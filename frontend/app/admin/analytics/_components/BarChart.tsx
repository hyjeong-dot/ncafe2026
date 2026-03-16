'use client';

import { DailyData, HourlyData } from './useAnalytics';
import styles from '../page.module.css';

interface BarChartProps {
    title: string;
    data: { label: string; value: number }[];
    colorClass?: string;
}

export default function BarChart({ title, data, colorClass }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.chartContainer}>
                {data.map((d) => (
                    <div key={d.label} className={styles.barGroup}>
                        <div className={styles.barWrapper}>
                            <div
                                className={`${styles.bar} ${colorClass || ''}`}
                                style={{ height: `${(d.value / maxValue) * 100}%` }}
                                title={String(d.value)}
                            />
                        </div>
                        <span className={styles.barLabel}>{d.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

// 헬퍼: dailyData → BarChart용 데이터 변환
export function toDailyRevenueData(daily: DailyData[]) {
    return daily.map(d => ({ label: d.date.slice(5), value: d.revenue }));
}

export function toDailyOrderData(daily: DailyData[]) {
    return daily.map(d => ({ label: d.date.slice(5), value: d.orderCount }));
}

export function toHourlyData(hourly: HourlyData[]) {
    return hourly.map(h => ({ label: `${h.hour}시`, value: h.orderCount }));
}
