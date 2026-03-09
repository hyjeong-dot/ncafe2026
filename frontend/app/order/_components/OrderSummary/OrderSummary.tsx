"use client";

import { CartItem } from '@/context/CartContext';
import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
    items: CartItem[];
    totalPrice: number;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export default function OrderSummary({
    items,
    totalPrice,
    isSubmitting,
    onSubmit
}: OrderSummaryProps) {
    return (
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
                onClick={onSubmit}
                disabled={isSubmitting || items.length === 0}
            >
                {isSubmitting ? '결제 처리 중...' : `${totalPrice.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
}
