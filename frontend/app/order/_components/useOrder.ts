"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

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

    const paymentWidgetRef = useRef<any>(null);
    const paymentMethodsWidgetRef = useRef<any>(null);

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

    // 결제위젯 초기화
    useEffect(() => {
        if (!user || totalPrice <= 0 || !TOSS_CLIENT_KEY) return;

        const initWidget = async () => {
            try {
                const customerKey = user.username || 'guest_' + Date.now();
                const paymentWidget = await loadPaymentWidget(TOSS_CLIENT_KEY, customerKey);
                paymentWidgetRef.current = paymentWidget;

                // 결제 수단 UI 렌더링
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    '#payment-widget',
                    totalPrice
                );
                paymentMethodsWidgetRef.current = paymentMethodsWidget;

                // 약관 UI 렌더링
                paymentWidget.renderAgreement('#agreement-widget');
            } catch (error) {
                console.error('결제위젯 초기화 실패:', error);
            }
        };

        initWidget();
    }, [user, totalPrice]);

    // 금액 변경 시 위젯 업데이트
    useEffect(() => {
        if (paymentMethodsWidgetRef.current && totalPrice > 0) {
            paymentMethodsWidgetRef.current.updateAmount(totalPrice);
        }
    }, [totalPrice]);

    const handleSubmitOrder = async () => {
        if (items.length === 0) return;
        if (!orderType) {
            toast.error('매장 이용 방법을 선택해 주세요.');
            return;
        }
        if (!paymentWidgetRef.current) {
            toast.error('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
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

            // 장바구니/directOrder 정리
            if (isDirectOrder) {
                sessionStorage.removeItem('directOrder');
            } else {
                await clearCart();
            }

            // 2. 결제위젯으로 결제 요청
            const orderName = items.length > 1
                ? `${items[0].korName} 외 ${items.length - 1}건`
                : items[0].korName;

            await paymentWidgetRef.current.requestPayment({
                orderId: orderUid,
                orderName,
                customerName: user?.name || '고객',
                customerEmail: user?.email || undefined,
                successUrl: `${window.location.origin}/order/success`,
                failUrl: `${window.location.origin}/order/fail`,
            });

        } catch (error: any) {
            console.error('Payment error:', error);
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
