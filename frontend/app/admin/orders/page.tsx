'use client';

import { useAdminOrders } from './_components/useAdminOrders';
import OrderList from './_components/OrderList';
import OrderEmptyState from './_components/OrderEmptyState';
import styles from './page.module.css';
import DashboardLoading from '../_components/DashboardLoading';

export default function AdminOrdersPage() {
    const { orders, isLoading, updateStatus } = useAdminOrders();

    if (isLoading) return <DashboardLoading />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 관리 📋</h1>

            {orders.length === 0 ? (
                <OrderEmptyState />
            ) : (
                <OrderList orders={orders} onUpdateStatus={updateStatus} />
            )}
        </div>
    );
}
