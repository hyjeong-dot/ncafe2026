'use client';

import { UtensilsCrossed, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import styles from '../page.module.css';

interface DashboardStatsProps {
    stats: {
        total: number;
    };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={`${styles.statIconWrapper} ${styles.blue}`}>
                    <UtensilsCrossed size={24} />
                </div>
                <div className={styles.statInfo}>
                    <p className={styles.statLabel}>등록된 메뉴</p>
                    <p className={styles.statValue}>{stats.total}개</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={`${styles.statIconWrapper} ${styles.green}`}>
                    <ShoppingBag size={24} />
                </div>
                <div className={styles.statInfo}>
                    <p className={styles.statLabel}>오늘 주문</p>
                    <p className={styles.statValue}>28건</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={`${styles.statIconWrapper} ${styles.orange}`}>
                    <TrendingUp size={24} />
                </div>
                <div className={styles.statInfo}>
                    <p className={styles.statLabel}>오늘 매출</p>
                    <p className={styles.statValue}>₩385,000</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={`${styles.statIconWrapper} ${styles.purple}`}>
                    <Users size={24} />
                </div>
                <div className={styles.statInfo}>
                    <p className={styles.statLabel}>오늘 방문</p>
                    <p className={styles.statValue}>45명</p>
                </div>
            </div>
        </div>
    );
}
