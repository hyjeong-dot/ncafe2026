"use client";

import Image from "next/image";
import styles from "./MyPageCoupons.module.css";

interface StampCardProps {
    stamps: number;
    completed: boolean;
}

export default function StampCard({ stamps, completed }: StampCardProps) {
    const totalSlots = 10;

    return (
        <div className={styles.stampCard}>
            <div className={styles.stampHeader}>
                <h4>🫠 단골 스탬프 카드</h4>
                <span className={styles.stampCount}>{stamps} / {totalSlots}</span>
            </div>
            <p className={styles.stampDesc}>
                10잔 적립하면 아메리카노 한 잔 무료! 꼬물꼬물 모아보자몽 💜
            </p>
            <div className={styles.stampGrid}>
                {Array.from({ length: totalSlots }, (_, i) => (
                    <div
                        key={i}
                        className={`${styles.stampSlot} ${i < stamps ? styles.stampFilled : ""}`}
                    >
                        {i < stamps ? (
                            <Image
                                src="/images/ditto/favicon-ditto.png"
                                alt="메타몽 스탬프"
                                width={100}
                                height={100}
                                className={styles.stampImg}
                            />
                        ) : (
                            i + 1
                        )}
                    </div>
                ))}
            </div>
            {completed && (
                <div className={styles.stampComplete}>
                    🎉 10잔 달성! 아메리카노 무료 쿠폰이 발급되었어요!
                </div>
            )}
        </div>
    );
}
