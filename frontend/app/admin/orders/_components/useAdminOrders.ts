import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface AdminOrderItem {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
}

export interface AdminOrder {
    id: number;
    nickname: string;
    totalPrice: number;
    status: string;
    statusLabel: string;
    orderType: string;
    requestMemo: string;
    items: AdminOrderItem[];
    createdAt: string;
}

export function useAdminOrders() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/orders');
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!response.ok) throw new Error('주문 목록을 불러오는데 실패했습니다.');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Fetch orders error:', error);
            toast.error('주문 목록을 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();

        let eventSource: EventSource | null = null;
        let retryCount = 0;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;
        let unmounted = false;

        const connect = () => {
            if (unmounted) return;

            eventSource = new EventSource('/api/admin/orders/stream');

            eventSource.addEventListener('order-update', (event) => {
                retryCount = 0; // 성공적으로 이벤트를 받으면 카운터 리셋
                fetchOrders();

                if (event.data === 'new-order') {
                    toast('🔔 새 주문이 들어왔습니다!', { icon: '📦' });
                }
            });

            eventSource.addEventListener('connected', () => {
                console.log('[SSE] 주문 스트림 연결됨');
                retryCount = 0;
            });

            eventSource.onerror = () => {
                eventSource?.close();
                eventSource = null;

                if (unmounted) return;

                // 지수 백오프: 2초, 4초, 8초, 16초, 최대 30초
                retryCount++;
                const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 30000);
                console.warn(`[SSE] 연결 끊김. ${delay / 1000}초 후 재연결 시도... (${retryCount}회)`);

                retryTimer = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            unmounted = true;
            eventSource?.close();
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, [fetchOrders]);

    const updateStatus = async (orderId: number, status: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status?status=${status}`, {
                method: 'PATCH'
            });
            if (!response.ok) throw new Error('상태 변경 실패');
            
            toast.success('주문 상태가 변경되었습니다! 🪄');
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('주문 상태 변경 중 오류가 발생했습니다.');
        }
    };

    return {
        orders,
        isLoading,
        updateStatus,
        refresh: fetchOrders
    };
}
