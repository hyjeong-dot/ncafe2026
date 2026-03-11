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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // 30초마다 실시간으로 오늘의 주문 건수 등을 업데이트해몽! (._.)✨
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return {
        stats,
        isLoading
    };
}
