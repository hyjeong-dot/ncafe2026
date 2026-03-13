'use client';

import { useState } from 'react';
import { AdminOrder } from './useAdminOrders';
import Modal from '@/components/common/Modal/Modal';
import styles from '../page.module.css';

interface OrderCardProps {
    order: AdminOrder;
    onUpdateStatus: (orderId: number, status: string) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
    const [isCancelOpen, setIsCancelOpen] = useState(false);

    return (
        <>
            <div className={styles.orderCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.orderId}># {order.id}</span>
                    <span className={styles.orderTime}>
                        {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </span>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.itemsInfo}>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemLine}>
                                <span>{item.menuName} x {item.quantity}</span>
                                <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className={styles.totalPrice}>
                            합계: ₩{order.totalPrice.toLocaleString()}
                        </div>
                    </div>

                    <div className={styles.customerInfo}>
                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>주문자</span>
                            <div className={styles.infoValue}>{order.nickname}</div>
                        </div>
                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>메모</span>
                            <div className={styles.infoValue}>{order.requestMemo || '-'}</div>
                        </div>
                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>타입</span>
                            <div className={styles.infoValue}>
                                {order.orderType === 'TOGO' ? '테이크아웃 🥡' : '매장 이용 ☕'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={`${styles.statusBadge} ${styles[`badge-${order.status.toLowerCase()}`]}`}>
                        {order.statusLabel}
                    </div>

                    <div className={styles.actions}>
                        {order.status === 'PAID' && (
                            <button 
                                className={`${styles.btn} ${styles.btnPrepare}`}
                                onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                            >
                                제조 시작 🪄
                            </button>
                        )}
                        {order.status === 'PREPARING' && (
                            <button 
                                className={`${styles.btn} ${styles.btnComplete}`}
                                onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                            >
                                제공 완료 ✅
                            </button>
                        )}
                        {['PAID', 'PENDING', 'PREPARING'].includes(order.status) && (
                            <button 
                                className={`${styles.btn} ${styles.btnCancel}`}
                                onClick={() => setIsCancelOpen(true)}
                            >
                                주문 취소 ❌
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                title="주문 취소"
                description="정말 이 주문을 취소하시겠몽? 취소된 주문은 되돌릴 수 없어요. (._.) "
                confirmText="취소하기"
                cancelText="돌아가기"
                variant="danger"
                onConfirm={() => {
                    onUpdateStatus(order.id, 'CANCELLED');
                }}
            />
        </>
    );
}
