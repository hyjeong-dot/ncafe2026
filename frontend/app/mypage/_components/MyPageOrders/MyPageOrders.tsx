"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MyPageOrders.module.css";
import { fetchAPI } from "@/lib/api";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import toast from 'react-hot-toast';

interface OrderResult {
    orderId: number;
    totalPrice: number;
    orderType: string;
    status: string;
    createdAt: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING':
            return <span style={{ color: 'var(--color-primary)' }}>결제 대기</span>;
        case 'PAID':
            return <span style={{ color: 'var(--color-secondary)' }}>결제 완료</span>;
        case 'PREPARING':
            return <span style={{ color: 'var(--color-warning)' }}>제조 중</span>;
        case 'COMPLETED':
            return <span style={{ color: 'var(--color-success)' }}>제공 완료</span>;
        case 'CANCELLED':
            return <span style={{ color: 'var(--color-error)' }}>취소됨</span>;
        default:
            return <span>{status}</span>;
    }
}

export default function MyPageOrders() {
    const [orders, setOrders] = useState<OrderResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchAPI('/orders');
                setOrders(data || []);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('정말 주문을 취소하시겠습니까?')) return;
        
        try {
            await fetchAPI(`/orders/${orderId}/cancel`, {
                method: 'PATCH'
            });
            toast.success('주문이 취소되었습니다.');
            // 상태 업데이트
            setOrders(orders.map(o => 
                o.orderId === orderId ? { ...o, status: 'CANCELLED' } : o
            ));
        } catch (error: any) {
            toast.error(error.message || '주문 취소 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.content}>
                 <LoadingDitto message="주문 내역을 불러오는 중..." size={150} />
            </div>
        );
    }

    return (
        <div className={styles.content}>
            <h3 className={styles.sectionTitle}>주문 내역</h3>
            
            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    아직 주문하신 내역이 없어요. <br />
                    <Link href="/menus" className={styles.menuLink}>맛있는 커피 보러 가기 ☕</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {orders.map(order => (
                        <div key={order.orderId} style={{ 
                            padding: '1.5rem', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                    &nbsp;|&nbsp;
                                    {order.orderType === 'DINE_IN' ? '매장' : '포장'}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    총 {order.totalPrice.toLocaleString()}원
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                    {getStatusBadge(order.status)}
                                </div>
                                {(order.status === 'PENDING' || order.status === 'PAID') && (
                                    <button 
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            backgroundColor: 'var(--color-error-light)',
                                            color: 'var(--color-error)',
                                            border: '1px solid var(--color-error)',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        주문 취소
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
