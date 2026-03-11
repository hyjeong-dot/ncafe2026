'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface DashboardStatsData {
    totalMenus: number;
    todayOrders: number;
    todaySales: number;
    todayVisits: number;
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStatsData>({
        totalMenus: 0,
        todayOrders: 0,
        todaySales: 0,
        todayVisits: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/dashboard/stats');
                
                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }
                
                if (!response.ok) throw new Error('대시보드 데이터를 불러오는데 실패했습니다.');

                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Dashboard Fetch error:', error);
                toast.error('통계 데이터를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return {
        stats,
        isLoading
    };
}
