"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
const TOSS_CHANNEL_KEY = process.env.NEXT_PUBLIC_TOSS_CHANNEL_KEY || '';

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

    // Redirect to login if unauthenticated or menus if empty cart
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                toast.error('로그인이 필요합니다.');
                router.replace('/login?redirect=/order');
            } else if (items.length === 0 && !isSuccessModalOpen && cartItems.length === 0 && !sessionStorage.getItem('directOrder')) {
                toast.error('주문할 상품이 없습니다.');
                router.replace('/menus');
            }
        }
    }, [user, authLoading, items, cartItems, router, isSuccessModalOpen]);

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
            }
        } else {
            setItems(cartItems);
            setTotalPrice(cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0));
            setIsDirectOrder(false);
        }
    }, [cartItems]);

    useEffect(() => {
        setCartOpen(false);
    }, [setCartOpen]);

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
                menuId: parseInt(item.id),
                quantity: item.quantity
            }));

            const orderResult = await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    orderType,
                    requestMemo,
                    items: formattedItems
                })
            });

            const { orderUid, totalPrice: orderTotal } = orderResult;

            // 장바구니/directOrder 정리 (결제 실패 시에도 주문은 PENDING으로 남음)
            if (isDirectOrder) {
                sessionStorage.removeItem('directOrder');
            } else {
                await clearCart();
            }

            // 2. 토스페이먼츠 결제 요청
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
            const payment = tossPayments.payment({ customerKey: user?.username || 'guest' });

            // 주문 이름 생성 (첫 번째 메뉴 + 외 N개)
            const orderName = items.length > 1
                ? `${items[0].korName} 외 ${items.length - 1}건`
                : items[0].korName;

            await payment.requestPayment({
                method: 'CARD',
                amount: {
                    currency: 'KRW',
                    value: orderTotal,
                },
                orderId: orderUid,
                orderName,
                customerName: user?.name || '고객',
                successUrl: `${window.location.origin}/order/success`,
                failUrl: `${window.location.origin}/order/fail`,
                card: {
                    useEscrow: false,
                    flowMode: 'DEFAULT',
                    useCardPoint: false,
                    useAppCardOnly: false,
                },
            });

        } catch (error: any) {
            console.error('Payment error:', error);
            // 사용자가 결제 취소한 경우
            if (error?.code === 'USER_CANCEL' || error?.code === 'PAY_PROCESS_CANCELED') {
                toast.error('결제가 취소되었습니다.');
            } else {
                toast.error(error.message || '결제 처리 중 오류가 발생했습니다.');
            }
            setIsSubmitting(false);
        }
    };

    const handleSuccessConfirm = () => {
        setSuccessModalOpen(false);
        router.push('/mypage?tab=orders');
    };

    const isLoading = authLoading || !user || (items.length === 0 && !isSuccessModalOpen);

    return {
        isLoading,
        items,
        totalPrice,
        orderType,
        setOrderType,
        requestMemo,
        setRequestMemo,
        isSubmitting,
        isSuccessModalOpen,
        handleSubmitOrder,
        handleSuccessConfirm
    };
}
