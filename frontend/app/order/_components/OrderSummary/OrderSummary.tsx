"use client";

import { CartItem } from '@/context/CartContext';
import { CouponData } from '../useOrder';
import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
    items: CartItem[];
    totalPrice: number;
    finalPrice: number;
    isSubmitting: boolean;
    onSubmit: () => void;
    availableCoupons: CouponData[];
    selectedCouponId: number | null;
    onCouponSelect: (id: number | null) => void;
    discountAmount: number;
}

export default function OrderSummary({
    items,
    totalPrice,
    finalPrice,
    isSubmitting,
    onSubmit,
    availableCoupons,
    selectedCouponId,
    onCouponSelect,
    discountAmount,
}: OrderSummaryProps) {
    return (
        <div className={styles.summarySection}>
            <h3>주문 상세 정보</h3>
            
            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>
                               {item.korName}
                            </div>
                            {item.selectedOptionNames && item.selectedOptionNames.length > 0 && (
                                <div className={styles.itemOptions}>
                                    {item.selectedOptionNames.join(' · ')}
                                </div>
                            )}
                        </div>
                        <div className={styles.itemQty}>{item.quantity}개</div>
                        <div className={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}원</div>
                    </div>
                ))}
            </div>

            {/* 쿠폰 선택 */}
            <div className={styles.couponSection}>
                <label className={styles.couponLabel}>🎫 쿠폰 적용</label>
                <select
                    className={styles.couponSelect}
                    value={selectedCouponId ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onCouponSelect(val ? parseInt(val) : null);
                    }}
                >
                    <option value="">쿠폰 선택 안 함</option>
                    {availableCoupons.map(coupon => (
                        <option key={coupon.id} value={coupon.id}>
                            {coupon.name}
                            {coupon.type === 'FIXED' && ` (${coupon.discount.toLocaleString()}원 할인)`}
                            {coupon.type === 'PERCENT' && ` (${coupon.discount}% 할인)`}
                            {coupon.type === 'FREE_DRINK' && ' (무료 음료)'}
                        </option>
                    ))}
                </select>
                {discountAmount > 0 && (
                    <div className={styles.discountInfo}>
                        -  {discountAmount.toLocaleString()}원 할인 적용!
                    </div>
                )}
            </div>

            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>상품 금액</span>
                <span className={styles.originalPrice}>{totalPrice.toLocaleString()}원</span>
            </div>

            {discountAmount > 0 && (
                <div className={styles.discountRow}>
                    <span className={styles.discountLabel}>쿠폰 할인</span>
                    <span className={styles.discountPrice}>-{discountAmount.toLocaleString()}원</span>
                </div>
            )}

            <div className={styles.finalRow}>
                <span className={styles.totalLabel}>총 결제 금액</span>
                <span className={styles.totalPrice}>{finalPrice.toLocaleString()}원</span>
            </div>

            <button 
                className={styles.submitBtn} 
                onClick={onSubmit}
                disabled={isSubmitting || items.length === 0}
            >
                {isSubmitting ? '결제 처리 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
}
