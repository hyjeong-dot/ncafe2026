'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
    const [errorMessage, setErrorMessage] = useState('');
    const confirmedRef = useRef(false);

    useEffect(() => {
        if (confirmedRef.current) return;
        confirmedRef.current = true;

        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
            setStatus('error');
            setErrorMessage('결제 정보가 올바르지 않습니다.');
            return;
        }

        const confirmPayment = async () => {
            try {
                const response = await fetch('/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: Number(amount),
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || '결제 승인에 실패했습니다.');
                }

                setStatus('success');
            } catch (err: any) {
                console.error('Payment confirmation error:', err);
                setStatus('error');
                setErrorMessage(err.message || '결제 승인 중 오류가 발생했습니다.');
            }
        };

        confirmPayment();
    }, [searchParams]);

    if (status === 'confirming') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <Loader2 size={48} className={styles.spinner} />
                    <h2 className={styles.title}>결제 승인 중...</h2>
                    <p className={styles.description}>잠시만 기다려주세요.</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.errorIcon}>❌</div>
                    <h2 className={styles.title}>결제 실패</h2>
                    <p className={styles.description}>{errorMessage}</p>
                    <button className={styles.primaryBtn} onClick={() => router.push('/menus')}>
                        메뉴로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <CheckCircle size={56} className={styles.successIcon} />
                <h2 className={styles.title}>결제가 완료되었어요! 🎉</h2>
                <p className={styles.description}>
                    메타몽 바리스타가 주문을 확인하고<br />
                    맛있는 메뉴를 준비하고 있어요! 💜
                </p>
                <div className={styles.buttonGroup}>
                    <button className={styles.primaryBtn} onClick={() => router.push('/mypage?tab=orders')}>
                        주문 내역 보기
                    </button>
                    <button className={styles.secondaryBtn} onClick={() => router.push('/menus')}>
                        메인으로 가기
                    </button>
                </div>
            </div>
        </div>
    );
}
