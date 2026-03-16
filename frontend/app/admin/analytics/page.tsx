'use client';

import { useState } from 'react';
import { useAnalytics } from './_components/useAnalytics';
import AnalyticsHeader from './_components/AnalyticsHeader';
import SummaryCards from './_components/SummaryCards';
import BarChart, { toDailyRevenueData, toDailyOrderData, toHourlyData, getAutoInterval } from './_components/BarChart';
import PopularMenuRank from './_components/PopularMenuRank';
import DashboardLoading from '../_components/DashboardLoading';
import styles from './page.module.css';

export default function AnalyticsPage() {
    const [days, setDays] = useState(7);
    const { data, isLoading } = useAnalytics(days);

    if (isLoading || !data) return <DashboardLoading />;

    const interval = getAutoInterval(data.dailyData.length);

    return (
        <main className={styles.container}>
            <AnalyticsHeader days={days} onDaysChange={setDays} />
            <SummaryCards data={data} />

            <BarChart
                title="📊 일별 매출"
                data={toDailyRevenueData(data.dailyData)}
                labelInterval={interval}
                formatValue={(v) => `₩${v.toLocaleString()}`}
            />

            <BarChart
                title="📋 일별 주문 건수"
                data={toDailyOrderData(data.dailyData)}
                colorClass={styles.barGreen}
                labelInterval={interval}
                formatValue={(v) => `${v}건`}
            />
            <BarChart
                title="🕐 시간대별 주문 분포"
                data={toHourlyData(data.hourlyDistribution)}
                colorClass={styles.barOrange}
                formatValue={(v) => `${v}건`}
            />

            <PopularMenuRank menus={data.popularMenus} />
        </main>
    );
}
