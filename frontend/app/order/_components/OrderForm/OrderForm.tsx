"use client";

import { Shield } from 'lucide-react';
import styles from './OrderForm.module.css';

interface OrderFormProps {
    orderType: 'DINE_IN' | 'TAKEOUT' | null;
    setOrderType: (type: 'DINE_IN' | 'TAKEOUT') => void;
    requestMemo: string;
    setRequestMemo: (memo: string) => void;
}

export default function OrderForm({
    orderType,
    setOrderType,
    requestMemo,
    setRequestMemo
}: OrderFormProps) {
    return (
        <div className={styles.formSection}>
            {/* 결제 수단 */}
            <div className={styles.formGroup}>
                <h3>결제 수단 💳</h3>
                <div className={styles.paymentCard}>
                    <div className={styles.tossBanner}>
                        <div className={styles.tossLeft}>
                            <Shield size={18} className={styles.shieldIcon} />
                            <span className={styles.tossText}>tosspayments</span>
                        </div>
                        <span className={styles.tossDesc}>안전한 결제</span>
                    </div>
                    <div className={styles.paymentInfo}>
                        <div className={styles.paymentMethod}>
                            <span className={styles.methodIcon}>💳</span>
                            <div>
                                <p className={styles.methodTitle}>신용/체크카드</p>
                                <p className={styles.methodSub}>결제하기를 누르면 토스 결제창이 열립니다</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 매장 이용 방법 */}
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

            {/* 요청사항 */}
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
    );
}
