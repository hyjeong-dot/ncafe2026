"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './MyPageReviews.module.css';

interface ReviewData {
    id: number;
    orderId: number;
    content: string;
    rating: number;
    stickerNumber: number | null;
    nickname: string;
    stickerEnded: boolean;
    menuNames: string | null;
    createdAt: string;
}

interface StickerStatus {
    collectedCount: number;
    maxStickers: number;
    stickerEnded: boolean;
}

export default function MyPageReviews() {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [stickerStatus, setStickerStatus] = useState<StickerStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [reviewsData, stickersData] = await Promise.all([
                    fetchAPI('/reviews'),
                    fetchAPI('/reviews/stickers')
                ]);
                setReviews(reviewsData || []);
                setStickerStatus(stickersData);
            } catch (e) {
                console.error('Failed to load reviews:', e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
        ));

    if (isLoading) {
        return <div className={styles.content}>로딩 중...</div>;
    }

    return (
        <div className={styles.content}>
            {/* 스티커 컬렉션 */}
            <h3 className={styles.sectionTitle}>🎨 메타몽 스티커 컬렉션</h3>
            <div className={styles.stickerGrid}>
                {[1, 2, 3, 4, 5].map(num => {
                    const collected = stickerStatus && num <= stickerStatus.collectedCount;
                    return (
                        <div key={num} className={`${styles.stickerSlot} ${collected ? styles.collected : styles.locked}`}>
                            {collected ? (
                                <Image
                                    src={`/stickers/sticker-${num}.png?v=2`}
                                    alt={`메타몽 스티커 #${num}`}
                                    width={100}
                                    height={100}
                                    className={styles.stickerImg}
                                />
                            ) : (
                                <div className={styles.lockedIcon}>?</div>
                            )}
                            <span className={styles.stickerLabel}>#{num}</span>
                        </div>
                    );
                })}
            </div>
            {stickerStatus?.stickerEnded && (
                <div className={styles.stickerEndedBanner}>
                    🎉 축하해요! 메타몽 스티커 5종을 모두 모았어요! 💜
                </div>
            )}
            {stickerStatus && !stickerStatus.stickerEnded && (
                <div className={styles.stickerProgress}>
                    리뷰를 작성하면 메타몽 스티커를 받을 수 있어요! ({stickerStatus.collectedCount}/{stickerStatus.maxStickers})
                </div>
            )}

            {/* 내 리뷰 목록 */}
            <h3 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>📝 내 리뷰</h3>
            {reviews.length === 0 ? (
                <div className={styles.emptyState}>
                    아직 작성한 리뷰가 없어요.<br />
                    주문 완료 후 리뷰를 남겨보세요! 💬
                </div>
            ) : (
                <div className={styles.reviewList}>
                    {reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewStars}>{renderStars(review.rating)}</div>
                                <span className={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className={styles.reviewContent}>{review.content}</p>
                            <div className={styles.reviewFooter}>
                                <span className={styles.orderTag}>{review.menuNames || `주문 #${review.orderId}`}</span>
                                {review.stickerNumber && (
                                    <div className={styles.stickerBadge}>
                                        <Image
                                            src={`/stickers/sticker-${review.stickerNumber}.png?v=2`}
                                            alt={`스티커 #${review.stickerNumber}`}
                                            width={32}
                                            height={32}
                                        />
                                        <span>스티커 #{review.stickerNumber} 획득!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
