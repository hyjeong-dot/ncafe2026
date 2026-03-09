"use client";

import styles from './OrderHeader.module.css';

export default function OrderHeader() {
    return (
        <div className={styles.header}>
            <h1>주문/결제 💜</h1>
            <p>메타몽 바리스타가 맛있게 만들어 드릴게요!</p>
        </div>
    );
}
