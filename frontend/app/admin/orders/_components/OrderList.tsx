'use client';

import { AdminOrder } from './useAdminOrders';
import OrderCard from './OrderCard';
import styles from '../page.module.css';

interface OrderListProps {
    orders: AdminOrder[];
    onUpdateStatus: (orderId: number, status: string) => void;
}

export default function OrderList({ orders, onUpdateStatus }: OrderListProps) {
    return (
        <div className={styles.orderList}>
            {orders.map((order) => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={onUpdateStatus} 
                />
            ))}
        </div>
    );
}
