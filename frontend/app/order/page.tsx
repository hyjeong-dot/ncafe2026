"use client";

import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './page.module.css';
import { OrderHeader, OrderForm, OrderSummary, useOrder } from './_components';

export default function OrderPage() {
    const {
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
    } = useOrder();

    if (isLoading) {
        return <div className={styles.container}>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <OrderHeader />

            <div className={styles.content}>
                {/* 왼쪽 폼 영역 */}
                <OrderForm 
                    orderType={orderType}
                    setOrderType={setOrderType}
                    requestMemo={requestMemo}
                    setRequestMemo={setRequestMemo}
                />

                {/* 오른쪽 장바구니 요약 정보 */}
                <OrderSummary
                    items={items}
                    totalPrice={totalPrice}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitOrder}
                />
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
