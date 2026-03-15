"use client";

import { useEffect, useState } from "react";
import styles from "./MyPageCoupons.module.css";
import { fetchAPI } from "@/lib/api";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import CouponCard from "./CouponCard";
import StampCard from "./StampCard";

interface CouponData {
    id: number;
    name: string;
    description: string;
    type: string;
    discount: number;
    minOrder: number;
    code: string;
    status: string;
    usable: boolean;
    expiresAt: string;
    createdAt: string;
}

interface StampCardData {
    id: number | null;
    stamps: number;
    completed: boolean;
}

export default function MyPageCoupons() {
    const [coupons, setCoupons] = useState<CouponData[]>([]);
    const [stampCard, setStampCard] = useState<StampCardData>({ id: null, stamps: 0, completed: false });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [couponData, stampData] = await Promise.all([
                    fetchAPI("/coupons"),
                    fetchAPI("/coupons/stamp-card"),
                ]);
                setCoupons(couponData || []);
                setStampCard(stampData || { id: null, stamps: 0, completed: false });
            } catch (error) {
                console.error("Failed to load coupons:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.content}>
                <LoadingDitto message="쿠폰을 불러오는 중..." size={150} />
            </div>
        );
    }

    const activeCoupons = coupons.filter(c => c.status === "ACTIVE" && c.usable);
    const usedCoupons = coupons.filter(c => c.status !== "ACTIVE" || !c.usable);

    return (
        <div className={styles.content}>
            <h3 className={styles.sectionTitle}>🎫 내 쿠폰</h3>

            {/* 스탬프 카드 */}
            <StampCard stamps={stampCard.stamps} completed={stampCard.completed} />

            {/* 사용 가능한 쿠폰 */}
            <div className={styles.couponSection}>
                <h4 className={styles.subTitle}>
                    사용 가능한 쿠폰 <span className={styles.couponCount}>{activeCoupons.length}</span>
                </h4>
                {activeCoupons.length === 0 ? (
                    <div className={styles.emptyState}>
                        사용 가능한 쿠폰이 없어요 🥲
                    </div>
                ) : (
                    <div className={styles.couponList}>
                        {activeCoupons.map(coupon => (
                            <CouponCard key={coupon.id} {...coupon} />
                        ))}
                    </div>
                )}
            </div>

            {/* 사용 완료 / 만료 쿠폰 */}
            {usedCoupons.length > 0 && (
                <div className={styles.couponSection}>
                    <h4 className={styles.subTitle}>사용 완료 / 만료</h4>
                    <div className={styles.couponList}>
                        {usedCoupons.map(coupon => (
                            <CouponCard key={coupon.id} {...coupon} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
