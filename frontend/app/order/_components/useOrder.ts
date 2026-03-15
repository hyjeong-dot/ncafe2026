"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

// TossPayments V1 스크립트 로드
function loadTossScript(): Promise<any> {
    return new Promise((resolve, reject) => {
        if ((window as any).TossPayments) {
            resolve((window as any).TossPayments);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1/payment';
        script.onload = () => resolve((window as any).TossPayments);
        script.onerror = () => reject(new Error('토스페이먼츠 스크립트 로드 실패'));
        document.head.appendChild(script);
    });
}

export interface CouponData {
    id: number;
    name: string;
    description: string;
    type: string;
    discount: number;
    minOrder: number;
    code: string;
    status: string;
    usable: boolean;
    expiresAt: string;
}

export function useOrder() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { items: cartItems, clearCart, setCartOpen } = useCart();

    const [items, setItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isDirectOrder, setIsDirectOrder] = useState(false);

    const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEOUT' | null>(null);
    const [requestMemo, setRequestMemo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    // 쿠폰 관련 상태
    const [availableCoupons, setAvailableCoupons] = useState<CouponData[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Redirect to login if unauthenticated or menus if empty cart
    useEffect(() => {
        if (!authLoading && !isSubmitting) {
            if (!user) {
                toast.error('로그인이 필요합니다.');
                router.replace('/login?redirect=/order');
            } else if (items.length === 0 && !isSuccessModalOpen && cartItems.length === 0 && !sessionStorage.getItem('directOrder')) {
                toast.error('주문할 상품이 없습니다.');
                router.replace('/menus');
            }
        }
    }, [user, authLoading, items, cartItems, router, isSuccessModalOpen, isSubmitting]);

    useEffect(() => {
        const directOrderStr = sessionStorage.getItem('directOrder');
        if (directOrderStr) {
            try {
                const directItems = JSON.parse(directOrderStr);
                setItems(directItems);
                setTotalPrice(directItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0));
                setIsDirectOrder(true);
            } catch (e) {
                console.error("Failed to parse direct order", e);
                sessionStorage.removeItem('directOrder');
            }
        } else {
            setItems(cartItems);
            setTotalPrice(cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0));
            setIsDirectOrder(false);
        }

        // 주문 페이지 벗어날 때 directOrder 정리
        return () => {
            if (!isDirectOrder) return;
            // 결제 진행 중이 아니면 정리
            if (!isSubmitting) {
                sessionStorage.removeItem('directOrder');
            }
        };
    }, [cartItems]);

    useEffect(() => {
        setCartOpen(false);
    }, [setCartOpen]);

    // 사용 가능한 쿠폰 불러오기
    useEffect(() => {
        if (user) {
            fetchAPI('/coupons/active')
                .then(data => setAvailableCoupons(data || []))
                .catch(err => console.error('Failed to load coupons:', err));
        }
    }, [user]);

    // 쿠폰 선택 시 할인 계산
    const handleCouponSelect = (couponId: number | null) => {
        setSelectedCouponId(couponId);
        if (!couponId) {
            setDiscountAmount(0);
            return;
        }
        const coupon = availableCoupons.find(c => c.id === couponId);
        if (!coupon) {
            setDiscountAmount(0);
            return;
        }

        // 최소 주문 금액 체크
        if (coupon.minOrder > 0 && totalPrice < coupon.minOrder) {
            toast.error(`최소 주문 금액 ${coupon.minOrder.toLocaleString()}원 이상이어야 해요!`);
            setSelectedCouponId(null);
            setDiscountAmount(0);
            return;
        }

        let discount = 0;
        switch (coupon.type) {
            case 'FIXED':
                discount = coupon.discount;
                break;
            case 'PERCENT':
                discount = Math.floor(totalPrice * coupon.discount / 100);
                break;
            case 'FREE_DRINK':
                discount = coupon.discount; // 아메리카노 가격 4,500원 고정
                break;
        }
        setDiscountAmount(Math.min(discount, totalPrice));
    };

    const finalPrice = Math.max(0, totalPrice - discountAmount);

    const handleSubmitOrder = async () => {
        if (items.length === 0) return;
        if (!orderType) {
            toast.error('매장 이용 방법을 선택해 주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. 백엔드에 주문 생성 (PENDING 상태)
            const formattedItems = items.map(item => ({
                menuId: item.menuId || parseInt(item.id),
                quantity: item.quantity
            }));

            // 옵션 정보를 메모에 자동 포함
            const optionLines = items
                .filter(item => item.selectedOptionNames && item.selectedOptionNames.length > 0)
                .map(item => `[${item.korName}] ${item.selectedOptionNames!.join(', ')}`);
            const fullMemo = [
                ...(optionLines.length > 0 ? [`📋 옵션: ${optionLines.join(' / ')}`] : []),
                ...(requestMemo.trim() ? [requestMemo.trim()] : [])
            ].join('\n');

            const orderResult = await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    orderType,
                    requestMemo: fullMemo,
                    couponId: selectedCouponId,
                    items: formattedItems
                })
            });

            const { orderUid, totalPrice: orderTotal } = orderResult;

            // 2. 토스페이먼츠 V1 결제 요청 (장바구니 정리는 결제 성공 후)
            const TossPayments = await loadTossScript();
            const tossPayments = TossPayments(TOSS_CLIENT_KEY);

            const orderName = items.length > 1
                ? `${items[0].korName} 외 ${items.length - 1}건`
                : items[0].korName;

            // 결제 성공 URL에 정리 플래그 전달
            const successParams = new URLSearchParams();
            successParams.set('clearCart', isDirectOrder ? 'direct' : 'cart');

            tossPayments.requestPayment('카드', {
                amount: orderTotal,
                orderId: orderUid,
                orderName,
                customerName: user?.name || '고객',
                successUrl: `${window.location.origin}/order/success?${successParams.toString()}`,
                failUrl: `${window.location.origin}/order/fail`,
            });

        } catch (error: any) {
            console.error('Payment error:', error);
            const msg = error?.message || '';
            if (error?.code === 'USER_CANCEL' || error?.code === 'PAY_PROCESS_CANCELED' || msg.includes('취소')) {
                toast.error('결제가 취소되었습니다.');
            } else {
                toast.error(msg || '결제 처리 중 오류가 발생했습니다.');
            }
            setIsSubmitting(false);
        }
    };

    // 브라우저 뒤로가기(bfcache)로 돌아왔을 때 결제 상태 리셋
    useEffect(() => {
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                // bfcache에서 복원됨 (토스 결제 페이지에서 뒤로가기)
                setIsSubmitting(false);
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    const handleSuccessConfirm = () => {
        setSuccessModalOpen(false);
        router.push('/mypage?tab=orders');
    };

    const isLoading = authLoading || !user || (items.length === 0 && !isSuccessModalOpen);

    return {
        isLoading,
        items,
        totalPrice,
        finalPrice,
        orderType,
        setOrderType,
        requestMemo,
        setRequestMemo,
        isSubmitting,
        isSuccessModalOpen,
        handleSubmitOrder,
        handleSuccessConfirm,
        // 쿠폰
        availableCoupons,
        selectedCouponId,
        handleCouponSelect,
        discountAmount
    };
}
