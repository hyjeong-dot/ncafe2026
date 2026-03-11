import { useState, useEffect } from 'react';
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

    const fetchOrders = async () => {
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
    };

    useEffect(() => {
        fetchOrders();
        // Option: polling or SSE for real-time updates
        const interval = setInterval(fetchOrders, 30000); // 30초마다 갱신
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: number, status: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status?status=${status}`, {
                method: 'PATCH'
            });
            if (!response.ok) throw new Error('상태 변경 실패');
            
            toast.success('주문 상태가 변경되었습니다! 🪄');
            fetchOrders(); // Refresh
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
