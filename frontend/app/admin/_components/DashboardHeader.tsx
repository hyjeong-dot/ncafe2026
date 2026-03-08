'use client';

import styles from '../page.module.css';

export default function DashboardHeader() {
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div className={styles.header}>
            <h1 className={styles.greeting}>안녕하세요, 정사장님! 👋</h1>
            <p className={styles.date}>{today}</p>
        </div>
    );
}
