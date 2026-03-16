"use client";

import { useState, useEffect } from 'react';
import styles from './MenuReviews.module.css';

interface ReviewData {
    id: number;
    orderId: number;
    content: string;
    rating: number;
    stickerNumber: number | null;
    nickname: string;
    createdAt: string;
}

interface MenuReviewsProps {
    menuId: number;
}

export default function MenuReviews({ menuId }: MenuReviewsProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews/menu/${menuId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data || []);
                }
            } catch (e) {
                console.error('Failed to load reviews:', e);
            } finally {
                setIsLoading(false);
            }
        };
        if (menuId) fetchReviews();
    }, [menuId]);

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
        ));

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    if (isLoading) return null;
    if (reviews.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>💬 리뷰 ({reviews.length})</h3>
                {avgRating && (
                    <div className={styles.avgRating}>
                        <span className={styles.starFilled}>★</span>
                        <span className={styles.avgNumber}>{avgRating}</span>
                    </div>
                )}
            </div>

            <div className={styles.list}>
                {reviews.map(review => (
                    <div key={review.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.reviewer}>
                                <span className={styles.nickname}>{review.nickname}</span>
                                <div className={styles.stars}>{renderStars(review.rating)}</div>
                            </div>
                            <span className={styles.date}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className={styles.content}>{review.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
