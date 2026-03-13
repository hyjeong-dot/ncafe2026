"use client";

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
            <div className={styles.formGroup}>
                <h3>결제 수단 💳</h3>
                <div id="payment-widget" className={styles.paymentWidget} />
                <div id="agreement-widget" className={styles.agreementWidget} />
            </div>

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
    );
}
