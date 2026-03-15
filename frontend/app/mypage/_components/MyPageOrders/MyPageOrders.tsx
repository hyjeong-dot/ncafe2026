"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MyPageOrders.module.css";
import { fetchAPI } from "@/lib/api";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import Modal from "@/components/common/Modal/Modal";
import toast from 'react-hot-toast';

interface OrderResult {
    orderId: number;
    orderUid: string;
    totalPrice: number;
    orderType: string;
    status: string;
    createdAt: string;
}

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

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
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

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

    const handleCancelOrderClick = (orderId: number) => {
        setOrderToCancel(orderId);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (orderToCancel === null) return;
        
        try {
            await fetchAPI(`/orders/${orderToCancel}/cancel`, {
                method: 'PATCH'
            });
            toast.success('주문이 취소되었습니다.');
            setOrders(orders.map(o => 
                o.orderId === orderToCancel ? { ...o, status: 'CANCELLED' } : o
            ));
        } catch (error: any) {
            toast.error(error.message || '주문 취소 중 오류가 발생했습니다.');
        } finally {
            setIsCancelModalOpen(false);
            setOrderToCancel(null);
        }
    };

    const handlePayOrder = async (order: OrderResult) => {
        try {
            const script = document.createElement('script');
            script.src = 'https://js.tosspayments.com/v1/payment';
            
            await new Promise<void>((resolve, reject) => {
                if ((window as any).TossPayments) { resolve(); return; }
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.head.appendChild(script);
            });

            const TossPayments = (window as any).TossPayments;
            const tossPayments = TossPayments(TOSS_CLIENT_KEY);

            tossPayments.requestPayment('카드', {
                amount: order.totalPrice,
                orderId: order.orderUid,
                orderName: `주문 #${order.orderId}`,
                successUrl: `${window.location.origin}/order/success`,
                failUrl: `${window.location.origin}/order/fail`,
            });
        } catch (error) {
            toast.error('결제 모듈 로드에 실패했습니다.');
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
                                {order.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handlePayOrder(order)}
                                        style={{
                                            padding: '4px 12px',
                                            background: 'var(--ditto-600)',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '0.85rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        결제하기
                                    </button>
                                )}
                                {(order.status === 'PENDING' || order.status === 'PAID') && (
                                    <button 
                                        onClick={() => handleCancelOrderClick(order.orderId)}
                                        style={{
                                            padding: 0,
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-light)',
                                            fontSize: '0.85rem',
                                            textDecoration: 'underline',
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

            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    setIsCancelModalOpen(false);
                    setOrderToCancel(null);
                }}
                title="주문을 취소할까요? 🥺"
                description={`메타몽 바리스타가 준비를 멈추고 주문을 취소합니다.\n정말 취소하시겠어요?`}
                confirmText="네, 취소할래요"
                cancelText="아니요 (유지)"
                onConfirm={handleConfirmCancel}
                variant="ditto"
            />
        </div>
    );
}
