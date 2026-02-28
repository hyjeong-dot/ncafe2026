"use client";

import styles from "./MyPageMain.module.css";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import { useMyPage } from "./useMyPage";

// Components
import {
    MyPageHeader,
    MyPageSidebar,
    MyPageProfile,
    MyPageOrders
} from "..";

export default function MyPageMain() {
    const {
        user,
        isLoading,
        activeTab,
        setActiveTab,
        handleLogout
    } = useMyPage();

    if (isLoading || !user) {
        return (
            <div className={styles.container}>
                <div className={styles.placeholder}>
                    <LoadingDitto message="내 정보를 불러오는 중..." size={200} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <MyPageHeader />

            <div className={styles.grid}>
                <MyPageSidebar
                    user={user}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onLogout={handleLogout}
                />

                <main>
                    {activeTab === "profile" && <MyPageProfile user={user} />}
                    {activeTab === "orders" && <MyPageOrders />}
                    {(activeTab === "favorites" || activeTab === "payment") && (
                        <div style={{
                            background: 'var(--bg-primary)',
                            padding: 'var(--space-12)',
                            borderRadius: 'var(--radius-2xl)',
                            textAlign: 'center',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>준비 중인 서비스</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                                메타몽이 열심히 변신하며 준비하고 있어요! 💜
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
