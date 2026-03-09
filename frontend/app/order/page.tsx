"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI, getImageSrc } from '@/lib/api';
import Modal from '@/components/common/Modal/Modal';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function OrderPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { items, totalPrice, clearCart, setCartOpen } = useCart();
    const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEOUT'>('TAKEOUT');
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

    if (authLoading || !user || (items.length === 0 && !isSuccessModalOpen)) {
        return <div className={styles.container}>로딩 중...</div>;
    }

    const handleSubmitOrder = async () => {
        if (items.length === 0) return;

        setIsSubmitting(true);
        try {
            const formattedItems = items.map(item => ({
                menuId: parseInt(item.id), // Backend expects Long menuId
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
        router.push('/mypage?tab=orders'); // User's order history page using tab
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>주문/결제 💜</h1>
                <p>메타몽 바리스타가 맛있게 만들어 드릴게요!</p>
            </div>

            <div className={styles.content}>
                {/* 왼쪽 폼 영역 */}
                <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                        <h3>매장 이용 방법 ✨</h3>
                        <div className={styles.radioGroup}>
                            <label className={`${styles.radioLabel} ${orderType === 'DINE_IN' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="DINE_IN"
                                    checked={orderType === 'DINE_IN'}
                                    onChange={() => setOrderType('DINE_IN')}
                                />
                                매장 이용 (Dine-in)
                            </label>
                            <label className={`${styles.radioLabel} ${orderType === 'TAKEOUT' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="TAKEOUT"
                                    checked={orderType === 'TAKEOUT'}
                                    onChange={() => setOrderType('TAKEOUT')}
                                />
                                포장 (Takeout)
                            </label>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <h3>요청사항 📝</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="예: 시럽 빼주세요 메타몽!"
                            value={requestMemo}
                            onChange={(e) => setRequestMemo(e.target.value)}
                            maxLength={500}
                        />
                    </div>
                </div>

                {/* 오른쪽 장바구니 요약 정보 */}
                <div className={styles.summarySection}>
                    <h3>주문 상세 정보</h3>
                    
                    <div className={styles.itemList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemName}>
                                   {item.korName}
                                </div>
                                <div className={styles.itemQty}>{item.quantity}개</div>
                                <div className={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}원</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>총 결제 금액</span>
                        <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                    </div>

                    <button 
                        className={styles.submitBtn} 
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting || items.length === 0}
                    >
                        {isSubmitting ? '결제 처리 중...' : `${totalPrice.toLocaleString()}원 결제하기`}
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessConfirm}
                title="주문이 완료되었습니다! 🎉"
                description={`메타몽 바리스타가 주문을 확인하고 맛있는 메뉴를 준비하고 있어요!\n잠시만 기다려주세요 💜`}
                confirmText="주문 내역 보기"
                cancelText="메인으로 가기"
                onConfirm={handleSuccessConfirm}
                variant="ditto"
            />
        </div>
    );
}
