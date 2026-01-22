import { UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';
import styles from './MenuStats.module.css';

interface MenuStatsProps {
    stats: {
        total: number;
        available: number;
        soldOut: number;
    };
}

export default function MenuStats({ stats }: MenuStatsProps) {
    return (
        <section className={styles.statsBar} aria-label="Menu Statistics">
            <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.total}`}>
                    <UtensilsCrossed size={20} />
                </div>
                <div className={styles.statInfo}>
                    <span className={styles.statLabel}>전체 메뉴</span>
                    <span className={styles.statValue}>{stats.total}</span>
                </div>
            </div>
            <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.available}`}>
                    <CheckCircle size={20} />
                </div>
                <div className={styles.statInfo}>
                    <span className={styles.statLabel}>판매중</span>
                    <span className={styles.statValue}>{stats.available}</span>
                </div>
            </div>
            <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.soldOut}`}>
                    <XCircle size={20} />
                </div>
                <div className={styles.statInfo}>
                    <span className={styles.statLabel}>품절</span>
                    <span className={styles.statValue}>{stats.soldOut}</span>
                </div>
            </div>
        </section>
    );
}
