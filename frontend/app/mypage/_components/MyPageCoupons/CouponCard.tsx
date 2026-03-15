"use client";

import styles from "./MyPageCoupons.module.css";

interface CouponCardProps {
    id: number;
    name: string;
    description: string;
    type: string;
    discount: number;
    code: string;
    status: string;
    usable: boolean;
    expiresAt: string;
}

export default function CouponCard({
    name,
    description,
    type,
    discount,
    code,
    status,
    usable,
    expiresAt,
}: CouponCardProps) {
    const isActive = status === "ACTIVE" && usable;
    const expiryDate = new Date(expiresAt);
    const daysLeft = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    const getDiscountLabel = () => {
        switch (type) {
            case "FIXED":
                return `${discount.toLocaleString()}원 할인`;
            case "PERCENT":
                return `${discount}% 할인`;
            case "FREE_DRINK":
                return "무료 음료";
            default:
                return "";
        }
    };

    return (
        <div className={`${styles.couponCard} ${!isActive ? styles.couponUsed : ""}`}>
            <div className={styles.couponLeft}>
                <div className={styles.couponDiscount}>{getDiscountLabel()}</div>
                <div className={styles.couponName}>{name}</div>
                <div className={styles.couponDesc}>{description}</div>
            </div>
            <div className={styles.couponRight}>
                <div className={styles.couponCode}>{code}</div>
                <div className={styles.couponExpiry}>
                    {isActive
                        ? `D-${daysLeft}`
                        : status === "USED"
                            ? "사용 완료"
                            : "만료됨"
                    }
                </div>
            </div>
            {!isActive && <div className={styles.couponOverlay} />}
        </div>
    );
}
