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

        let eventSource: EventSource | null = null;
        let retryCount = 0;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;
        let unmounted = false;

        const connect = () => {
            if (unmounted) return;

            eventSource = new EventSource('/api/admin/orders/stream');

            eventSource.addEventListener('order-update', () => {
                retryCount = 0;
                fetchStats();
            });

            eventSource.addEventListener('connected', () => {
                retryCount = 0;
            });

            eventSource.onerror = () => {
                eventSource?.close();
                eventSource = null;

                if (unmounted) return;

                retryCount++;
                const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 30000);
                console.warn(`[SSE] 대시보드 연결 끊김. ${delay / 1000}초 후 재연결... (${retryCount}회)`);

                retryTimer = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            unmounted = true;
            eventSource?.close();
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, [fetchStats]);

    return {
        stats,
        isLoading
    };
}
