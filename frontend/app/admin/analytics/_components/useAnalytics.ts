import { useState, useEffect } from 'react';

export interface DailyData {
    date: string;
    revenue: number;
    orderCount: number;
}

export interface PopularMenu {
    menuName: string;
    totalQuantity: number;
    totalRevenue: number;
}

export interface HourlyData {
    hour: number;
    orderCount: number;
}

export interface SalesAnalytics {
    totalRevenue: number;
    totalOrders: number;
    cancelledOrders: number;
    cancelRate: number;
    dailyAverageRevenue: number;
    dailyData: DailyData[];
    popularMenus: PopularMenu[];
    hourlyDistribution: HourlyData[];
}

export function useAnalytics(days: number) {
    const [data, setData] = useState<SalesAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/admin/analytics/sales?days=${days}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [days]);

    return { data, isLoading };
}
