'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../success/page.module.css';

export default function PaymentFailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const code = searchParams.get('code') || '';
    const message = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.errorIcon}>😢</div>
                <h2 className={styles.title}>결제에 실패했어요</h2>
                <p className={styles.description}>
                    {message}
                    {code && <><br /><small style={{ color: '#a3a3a3' }}>오류 코드: {code}</small></>}
                </p>
                <div className={styles.buttonGroup}>
                    <button className={styles.primaryBtn} onClick={() => router.push('/order')}>
                        다시 주문하기
                    </button>
                    <button className={styles.secondaryBtn} onClick={() => router.push('/menus')}>
                        메뉴로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
