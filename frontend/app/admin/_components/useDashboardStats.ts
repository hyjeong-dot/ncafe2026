'use client';

import { useState, useEffect, useCallback } from 'react';

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

    const fetchStats = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchStats();

        // SSE 구독 — 주문 변경 시 대시보드 통계도 즉시 갱신
        const eventSource = new EventSource('/api/admin/orders/stream');

        eventSource.addEventListener('order-update', () => {
            fetchStats();
        });

        eventSource.onerror = () => {
            console.warn('[SSE] 대시보드 SSE 연결 끊김, 자동 재연결 시도...');
        };

        return () => {
            eventSource.close();
        };
    }, [fetchStats]);

    return {
        stats,
        isLoading
    };
}
