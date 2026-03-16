'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdminOrder } from './useAdminOrders';
import Modal from '@/components/common/Modal/Modal';
import styles from '../page.module.css';

interface OrderCardProps {
    order: AdminOrder;
    onUpdateStatus: (orderId: number, status: string) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        }) + ' ' + d.toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <>
            <div className={styles.orderCard}>
                {/* 헤더 행: 주문번호 | 날짜 | 타입 | 상태뱃지 | 접기 */}
                <div className={styles.cardHeader} onClick={() => setIsExpanded(!isExpanded)}>
                    <div className={styles.headerLeft}>
                        <span className={styles.orderId}>#{order.orderUid || order.id}</span>
                        <span className={styles.headerMeta}>
                            📅 {formatDate(order.createdAt)}
                        </span>
                        <span className={styles.headerMeta}>
                            {order.orderType === 'TOGO' ? '포장' : '매장'}
                        </span>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={`${styles.statusBadge} ${styles[`badge-${order.status.toLowerCase()}`]}`}>
                            {order.statusLabel}
                        </div>
                        <span className={styles.expandIcon}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                    </div>
                </div>

                {/* 요약 (접힌 상태에서도 보이는 정보) */}
                {!isExpanded && (
                    <div className={styles.collapsedSummary}>
                        <div className={styles.summaryInfo}>
                            <span className={styles.summaryLabel}>최종 결제 금액</span>
                            <span className={styles.summaryPrice}>₩{order.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className={styles.actions}>
                            {order.status === 'PAID' && (
                                <button
                                    className={`${styles.btn} ${styles.btnPrepare}`}
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'PREPARING'); }}
                                >
                                    🪄 메뉴 준비 시작
                                </button>
                            )}
                            {order.status === 'PREPARING' && (
                                <button
                                    className={`${styles.btn} ${styles.btnComplete}`}
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'COMPLETED'); }}
                                >
                                    ✅ 제공 완료
                                </button>
                            )}
                            {['PAID', 'PENDING', 'PREPARING'].includes(order.status) && (
                                <button
                                    className={`${styles.btn} ${styles.btnCancel}`}
                                    onClick={(e) => { e.stopPropagation(); setIsCancelOpen(true); }}
                                >
                                    ⊘ 주문 취소
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 펼친 상태 */}
                {isExpanded && (
                    <div className={styles.expandedBody}>
                        <div className={styles.cardBody}>
                            <div className={styles.itemsInfo}>
                                <div className={styles.sectionLabel}>주문 상품 ({order.items.length})</div>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.itemLine}>
                                        <span className={styles.itemName}>{item.menuName}</span>
                                        <span className={styles.itemDetail}>
                                            {item.price.toLocaleString()}원 × {item.quantity}개
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.customerInfo}>
                                <div className={styles.sectionLabel}>고객 정보</div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.infoLabel}>👤 주문자</span>
                                    <div className={styles.infoValue}>{order.nickname}</div>
                                </div>
                                {order.requestMemo && (
                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>📝 메모</span>
                                        <div className={styles.infoValue}>{order.requestMemo}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.totalSection}>
                                <span className={styles.totalLabel}>최종 결제 금액</span>
                                <span className={styles.totalPrice}>₩{order.totalPrice.toLocaleString()}</span>
                            </div>

                            <div className={styles.actions}>
                                {order.status === 'PAID' && (
                                    <button
                                        className={`${styles.btn} ${styles.btnPrepare}`}
                                        onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                                    >
                                        🪄 메뉴 준비 시작
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        className={`${styles.btn} ${styles.btnComplete}`}
                                        onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                                    >
                                        ✅ 제공 완료
                                    </button>
                                )}
                                {['PAID', 'PENDING', 'PREPARING'].includes(order.status) && (
                                    <button
                                        className={`${styles.btn} ${styles.btnCancel}`}
                                        onClick={() => setIsCancelOpen(true)}
                                    >
                                        ⊘ 주문 취소
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
