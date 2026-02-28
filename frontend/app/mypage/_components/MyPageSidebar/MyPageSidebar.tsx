"use client";

import Image from "next/image";
import {
    User,
    LogOut,
    History,
    Heart,
    CreditCard
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
}

export default function MyPageSidebar({
    user,
    activeTab,
    onTabChange,
    onLogout
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
                    className={`${styles.menuItem} ${activeTab === "payment" ? styles.active : ""}`}
                    onClick={() => onTabChange("payment")}
                >
                    <CreditCard size={18} />
                    결제 수단
                </button>
                <hr style={{ margin: 'var(--space-2) 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <button
                    className={styles.menuItem}
                    onClick={onLogout}
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
            </nav>
        </aside>
    );
}
