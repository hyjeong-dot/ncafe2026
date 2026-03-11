'use client';

import styles from '../page.module.css';

export default function DashboardLoading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
                <div className={styles.metaSlime}>🫠</div>
            </div>
            <p className={styles.loadingText}>데이터를 불러오는 중몽... 🪄</p>
        </div>
    );
}
