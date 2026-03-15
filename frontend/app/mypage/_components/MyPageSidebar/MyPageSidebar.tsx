"use client";

import Image from "next/image";
import {
    User,
    LogOut,
    History,
    Heart,
    CreditCard,
    UserMinus,
    Ticket,
    MessageSquare
} from "lucide-react";
import styles from "./MyPageSidebar.module.css";

interface User {
    username: string;
    role: string;
}

interface MyPageSidebarProps {
    user: User;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
}

export default function MyPageSidebar({
    user,
    activeTab,
    onTabChange,
    onLogout,
    onDeleteAccount
}: MyPageSidebarProps) {
    return (
        <aside className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
                <Image
                    src="/images/ditto/welcome-ditto.png"
                    alt="Avatar"
                    width={100}
                    height={100}
                    className={styles.avatar}
                />
            </div>
            <div className={styles.userInfo}>
                <h2 className={styles.username}>{user.username} 님</h2>
                <span className={styles.roleChip}>
                    {user.role === "ROLE_ADMIN" ? "관리자" : "카페 트레이너"}
                </span>
            </div>

            <nav className={styles.menuList}>
                <button
                    className={`${styles.menuItem} ${activeTab === "profile" ? styles.active : ""}`}
                    onClick={() => onTabChange("profile")}
                >
                    <User size={18} />
                    프로필 설정
                </button>
                <button
                    className={`${styles.menuItem} ${activeTab === "orders" ? styles.active : ""}`}
                    onClick={() => onTabChange("orders")}
                >
                    <History size={18} />
                    주문 내역
                </button>
                <button
                    className={`${styles.menuItem} ${activeTab === "favorites" ? styles.active : ""}`}
                    onClick={() => onTabChange("favorites")}
                >
                    <Heart size={18} />
                    찜한 메뉴
                </button>
                <button
                    className={`${styles.menuItem} ${activeTab === "coupons" ? styles.active : ""}`}
                    onClick={() => onTabChange("coupons")}
                >
                    <Ticket size={18} />
                    내 쿠폰
                </button>
                <button
                    className={`${styles.menuItem} ${activeTab === "reviews" ? styles.active : ""}`}
                    onClick={() => onTabChange("reviews")}
                >
                    <MessageSquare size={18} />
                    내 리뷰
                </button>
                <button
                    className={`${styles.menuItem} ${activeTab === "payment" ? styles.active : ""}`}
                    onClick={() => onTabChange("payment")}
                >
                    <CreditCard size={18} />
                    결제 수단
                </button>
            </nav>
            <hr style={{ margin: 'var(--space-2) 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div className={styles.bottomActions}>
                <button
                    className={styles.menuItem}
                    onClick={onLogout}
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
                <button
                    className={`${styles.menuItem} ${styles.dangerItem}`}
                    onClick={onDeleteAccount}
                >
                    <UserMinus size={18} />
                    회원탈퇴
                </button>
            </div>
        </aside>
    );
}
