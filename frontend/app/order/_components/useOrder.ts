"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useOrder() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { items, totalPrice, clearCart, setCartOpen } = useCart();

    const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEOUT' | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'KAKAOPAY'>('CARD');
    const [requestMemo, setRequestMemo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    // Redirect to login if unauthenticated or menus if empty cart
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                toast.error('로그인이 필요합니다.');
                router.replace('/login?redirect=/order');
            } else if (items.length === 0 && !isSuccessModalOpen) {
                // Not in success state and cart is empty
                toast.error('장바구니가 비어 있습니다.');
                router.replace('/menus');
            }
        }
    }, [user, authLoading, items, router, isSuccessModalOpen]);

    useEffect(() => {
        // Ensure cart is closed when arriving
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
            const formattedItems = items.map(item => ({
                menuId: parseInt(item.id),
                quantity: item.quantity
            }));

            await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    orderType,
                    requestMemo,
                    items: formattedItems
                })
            });

            // On success
            await clearCart();
            setSuccessModalOpen(true);
        } catch (error: any) {
            toast.error(error.message || '주문 처리 중 오류가 발생했습니다.');
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
        paymentMethod,
        setPaymentMethod,
        requestMemo,
        setRequestMemo,
        isSubmitting,
        isSuccessModalOpen,
        handleSubmitOrder,
        handleSuccessConfirm
    };
}
