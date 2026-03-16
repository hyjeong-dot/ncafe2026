'use client';

import styles from '../page.module.css';

const PERIOD_OPTIONS = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 0, label: '전체' },
];

interface AnalyticsHeaderProps {
    days: number;
    onDaysChange: (days: number) => void;
}

export default function AnalyticsHeader({ days, onDaysChange }: AnalyticsHeaderProps) {
    return (
        <div className={styles.pageHeader}>
            <div>
                <h1 className={styles.title}>매출 분석</h1>
                <p className={styles.subtitle}>기간별 매출 데이터와 인기 메뉴를 한눈에 확인하세요</p>
            </div>
            <div className={styles.periodTabs}>
                {PERIOD_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        className={`${styles.periodTab} ${days === opt.value ? styles.periodActive : ''}`}
                        onClick={() => onDaysChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
