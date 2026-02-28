"use client";

import Link from "next/link";
import styles from "./MyPageOrders.module.css";

export default function MyPageOrders() {
    return (
        <div className={styles.content}>
            <h3 className={styles.sectionTitle}>주문 내역</h3>
            <div className={styles.emptyState}>
                아직 주문하신 내역이 없어요. <br />
                <Link href="/menus" className={styles.menuLink}>맛있는 커피 보러 가기 ☕</Link>
            </div>
        </div>
    );
}
