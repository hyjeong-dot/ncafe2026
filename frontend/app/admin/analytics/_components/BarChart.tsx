'use client';

import { DailyData, HourlyData } from './useAnalytics';
import styles from '../page.module.css';

interface BarChartProps {
    title: string;
    data: { label: string; value: number }[];
    colorClass?: string;
    labelInterval?: number; // n개마다 라벨 표시 (기본 1)
    formatValue?: (v: number) => string;
}

export default function BarChart({ title, data, colorClass, labelInterval = 1, formatValue }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const needsScroll = data.length > 15;

    return (
        <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={`${styles.chartContainer} ${needsScroll ? styles.chartScroll : ''}`}
                 style={needsScroll ? { minWidth: `${data.length * 36}px` } : undefined}>
                {data.map((d, idx) => {
                    const showLabel = idx % labelInterval === 0 || idx === data.length - 1;
                    const tooltip = formatValue ? formatValue(d.value) : d.value.toLocaleString();
                    return (
                        <div key={d.label} className={styles.barGroup}>
                            <div className={styles.barWrapper}>
                                <div
                                    className={`${styles.bar} ${colorClass || ''}`}
                                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                                    title={`${d.label}: ${tooltip}`}
                                >
                                    {d.value > 0 && data.length <= 10 && (
                                        <span className={styles.barTooltip}>{tooltip}</span>
                                    )}
                                </div>
                            </div>
                            <span className={`${styles.barLabel} ${!showLabel ? styles.barLabelHidden : ''}`}>
                                {showLabel ? d.label : ''}
                            </span>
                        </div>
                    );
                })}
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

/** 데이터 개수에 따른 라벨 간격 자동 계산 */
export function getAutoInterval(count: number): number {
    if (count <= 10) return 1;
    if (count <= 15) return 2;
    if (count <= 31) return 5;
    return 7;
}
