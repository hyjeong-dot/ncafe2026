"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './OrderHeader.module.css';

export default function OrderHeader() {
    const router = useRouter();

    return (
        <div className={styles.header}>
            <button className={styles.backBtn} onClick={() => router.back()}>
                <ArrowLeft size={20} />
                <span>돌아가기</span>
            </button>
            <h1>주문/결제 💜</h1>
            <p>메타몽 바리스타가 맛있게 만들어 드릴게요!</p>
        </div>
    );
}
