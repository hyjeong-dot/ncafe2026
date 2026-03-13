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
                <div className={styles.tossBadge}>
                    <svg viewBox="0 0 60 22" width="60" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.48 5.57H0v3.05h2.39v8.06h3.43V8.62H8.5V5.57h-.02zm8.67 0H12.4l-3.2 11.11h3.38L14 12.2h3.59l1.42 4.48h3.38L19.15 5.57zM14.8 9.72l1.02-3.24 1.02 3.24H14.8zm13.07-1.1c-1.68 0-2.87.57-3.59 1.11l1.4 2.22c.48-.36 1.1-.63 1.74-.63.87 0 1.34.52 1.34 1.2v.3h-1.78c-2.1 0-3.34 1.02-3.34 2.67 0 1.42 1.02 2.55 2.84 2.55.99 0 1.74-.36 2.28-.9v.78h3.18V11.3c0-1.69-1.22-2.67-4.07-2.67zm.89 6.11c-.24.3-.66.54-1.14.54-.54 0-.87-.3-.87-.72 0-.48.36-.72.93-.72h1.08v.9zM40.8 8.62c-1.13 0-1.98.54-2.52 1.23V8.74h-3.24v7.94h3.3V12.5c0-.93.54-1.47 1.26-1.47.72 0 1.14.48 1.14 1.23v4.42h3.3v-5.28c0-1.89-1.31-2.78-3.24-2.78zm14.92-3.05H50.5l-3.2 11.11h3.38l1.42-4.48h3.59l1.42 4.48h3.38L57.25 5.57h-1.53zM52.9 9.72l1.02-3.24 1.02 3.24H52.9zm-8.8.9c-.72-.36-1.74-.63-2.76-.81-.87-.15-1.26-.24-1.26-.54 0-.24.3-.42.87-.42.78 0 1.8.24 2.58.66l1.2-2.16c-.93-.54-2.28-.87-3.72-.87-2.46 0-4.11 1.08-4.11 2.97 0 1.62 1.14 2.25 2.55 2.52.93.18 1.8.33 1.8.66 0 .3-.33.45-1.02.45-.96 0-2.16-.36-2.97-.84l-1.2 2.16c1.02.66 2.46 1.02 4.05 1.02 2.58 0 4.32-1.08 4.32-3.06 0-1.47-1.14-2.13-2.34-2.52z" fill="#0064FF"/>
                    </svg>
                    <span>토스페이먼츠로 안전하게 결제됩니다</span>
                </div>
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
