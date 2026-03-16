'use client';

import { useAdminOrders } from './_components/useAdminOrders';
import { useOrderFilters } from './_components/useOrderFilters';
import OrderToolbar from './_components/OrderToolbar';
import OrderList from './_components/OrderList';
import OrderEmptyState from './_components/OrderEmptyState';
import DashboardLoading from '../_components/DashboardLoading';
import styles from './page.module.css';

export default function AdminOrdersPage() {
    const { orders, isLoading, updateStatus } = useAdminOrders();
    const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredOrders } = useOrderFilters(orders);

    if (isLoading) return <DashboardLoading />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 관리</h1>

            <OrderToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                resultCount={filteredOrders.length}
            />

            {filteredOrders.length === 0 ? (
                <OrderEmptyState />
            ) : (
                <OrderList orders={filteredOrders} onUpdateStatus={updateStatus} />
            )}
        </div>
    );
}
