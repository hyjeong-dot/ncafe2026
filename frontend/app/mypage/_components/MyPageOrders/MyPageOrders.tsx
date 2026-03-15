"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

    // 리뷰 작성
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewedOrders, setReviewedOrders] = useState<Set<number>>(new Set());
    const [lastStickerResult, setLastStickerResult] = useState<{ stickerNumber: number | null; stickerEnded: boolean } | null>(null);

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
                                {(order.status === 'PAID' || order.status === 'COMPLETED') && !reviewedOrders.has(order.orderId) && (
                                    <button
                                        onClick={() => {
                                            setReviewOrderId(order.orderId);
                                            setReviewContent('');
                                            setReviewRating(5);
                                            setIsReviewModalOpen(true);
                                        }}
                                        style={{
                                            padding: '4px 12px',
                                            background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '0.85rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        ✍️ 리뷰 쓰기
                                    </button>
                                )}
                                {reviewedOrders.has(order.orderId) && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--ditto-600)' }}>✅ 리뷰 완료</span>
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

            {/* 리뷰 작성 모달 */}
            {isReviewModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setIsReviewModalOpen(false)}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '100%'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>✍️ 리뷰 작성</h3>
                        
                        {/* 별점 */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>별점</label>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} onClick={() => setReviewRating(n)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                                        color: n <= reviewRating ? '#f59e0b' : '#d1d5db'
                                    }}>★</button>
                                ))}
                            </div>
                        </div>

                        {/* 내용 */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>리뷰 내용</label>
                            <textarea
                                value={reviewContent}
                                onChange={e => setReviewContent(e.target.value)}
                                placeholder="메타몽 카페에서의 경험을 남겨주세요! 💜"
                                maxLength={500}
                                style={{
                                    width: '100%', minHeight: '120px', border: '1px solid #d1d5db', borderRadius: '8px',
                                    padding: '0.75rem', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
                                {reviewContent.length}/500
                            </div>
                        </div>

                        {/* 스티커 안내 */}
                        <div style={{
                            background: '#f5f3ff', borderRadius: '8px', padding: '0.75rem',
                            fontSize: '0.85rem', color: '#6d28d9', marginBottom: '1rem', textAlign: 'center'
                        }}>
                            🎨 리뷰를 남기면 메타몽 스티커를 받을 수 있어요!
                        </div>

                        {/* 스티커 결과 표시 */}
                        {lastStickerResult && (
                            <div style={{
                                background: '#fef3c7', borderRadius: '8px', padding: '1rem',
                                textAlign: 'center', marginBottom: '1rem'
                            }}>
                                {lastStickerResult.stickerNumber ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <Image src={`/stickers/sticker-${lastStickerResult.stickerNumber}.png`} 
                                            alt="스티커" width={80} height={80} />
                                        <span style={{ fontWeight: 600 }}>🎉 메타몽 스티커 #{lastStickerResult.stickerNumber} 획득!</span>
                                    </div>
                                ) : (
                                    <span>스티커 이벤트가 종료되었습니다. 감사합니다! 💜</span>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { setIsReviewModalOpen(false); setLastStickerResult(null); }}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>
                                닫기
                            </button>
                            {!lastStickerResult && (
                                <button onClick={async () => {
                                    if (!reviewContent.trim()) { toast.error('리뷰 내용을 입력해주세요.'); return; }
                                    try {
                                        const result = await fetchAPI('/reviews', {
                                            method: 'POST',
                                            body: JSON.stringify({ orderId: reviewOrderId, content: reviewContent, rating: reviewRating })
                                        });
                                        toast.success('리뷰가 등록되었습니다!');
                                        setReviewedOrders(prev => new Set(prev).add(reviewOrderId!));
                                        setLastStickerResult({ stickerNumber: result.stickerNumber, stickerEnded: result.stickerEnded });
                                    } catch (e: any) {
                                        toast.error(e.message || '리뷰 등록에 실패했습니다.');
                                    }
                                }} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff',
                                    fontWeight: 700, cursor: 'pointer'
                                }}>
                                    등록하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
