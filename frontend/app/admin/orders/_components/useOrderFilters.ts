import { useState, useMemo } from 'react';
import { AdminOrder } from './useAdminOrders';

export function useOrderFilters(orders: AdminOrder[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredOrders = useMemo(() => {
        let result = orders;

        if (statusFilter) {
            result = result.filter(o => o.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(o =>
                (o.orderUid && o.orderUid.toLowerCase().includes(q)) ||
                o.nickname.toLowerCase().includes(q) ||
                String(o.id).includes(q) ||
                o.items.some(item => item.menuName.toLowerCase().includes(q))
            );
        }

        return result;
    }, [orders, searchQuery, statusFilter]);

    return {
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        filteredOrders,
    };
}
