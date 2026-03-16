'use client';

import { SalesAnalytics } from './useAnalytics';
import styles from '../page.module.css';

interface SummaryCardsProps {
    data: SalesAnalytics;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
    return (
        <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>총 매출</span>
                <span className={styles.cardValue}>₩{data.totalRevenue.toLocaleString()}</span>
            </div>
            <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>총 주문</span>
                <span className={styles.cardValue}>{data.totalOrders.toLocaleString()}건</span>
            </div>
            <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>1일 평균 매출</span>
                <span className={styles.cardValue}>₩{data.dailyAverageRevenue.toLocaleString()}</span>
            </div>
            <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>취소율</span>
                <span className={`${styles.cardValue} ${data.cancelRate > 10 ? styles.danger : ''}`}>
                    {data.cancelRate}%
                </span>
                <span className={styles.cardSub}>{data.cancelledOrders}건 취소</span>
            </div>
        </div>
    );
}
