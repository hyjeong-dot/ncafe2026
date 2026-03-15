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

        // SSE 구독 — 주문 변경 시 실시간 갱신
        const eventSource = new EventSource('/api/admin/orders/stream');

        eventSource.addEventListener('order-update', (event) => {
            console.log('[SSE] 주문 업데이트:', event.data);
            fetchOrders(); // 변경 알림 받으면 전체 목록 새로고침

            if (event.data === 'new-order') {
                toast('🔔 새 주문이 들어왔습니다!', { icon: '📦' });
            }
        });

        eventSource.addEventListener('connected', () => {
            console.log('[SSE] 주문 스트림 연결됨');
        });

        eventSource.onerror = () => {
            console.warn('[SSE] 연결 끊김, 자동 재연결 시도...');
        };

        return () => {
            eventSource.close();
        };
    }, [fetchOrders]);

    const updateStatus = async (orderId: number, status: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status?status=${status}`, {
                method: 'PATCH'
            });
            if (!response.ok) throw new Error('상태 변경 실패');
            
            toast.success('주문 상태가 변경되었습니다! 🪄');
            // SSE가 이벤트를 보내서 자동 갱신되므로 수동 refresh 불필요
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
