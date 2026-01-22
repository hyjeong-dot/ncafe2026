import Link from 'next/link';
import {
    UtensilsCrossed,
    ShoppingBag,
    Users,
    TrendingUp,
    Plus,
    Settings,
    BarChart3,
} from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.greeting}>안녕하세요, 김사장님! 👋</h1>
                <p className={styles.date}>{today}</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.blue}`}>
                        <UtensilsCrossed size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>등록된 메뉴</p>
                        <p className={styles.statValue}>12개</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.green}`}>
                        <ShoppingBag size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>오늘 주문</p>
                        <p className={styles.statValue}>28건</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.orange}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>오늘 매출</p>
                        <p className={styles.statValue}>₩385,000</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.purple}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>오늘 방문</p>
                        <p className={styles.statValue}>45명</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>빠른 작업</h2>
                <div className={styles.actionsGrid}>
                    <Link href="/admin/menus/new" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Plus size={22} />
                        </div>
                        <div className={styles.actionText}>
                            <p className={styles.actionTitle}>새 메뉴 추가</p>
                            <p className={styles.actionDesc}>메뉴를 등록하세요</p>
                        </div>
                    </Link>

                    <Link href="/admin/menus" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <UtensilsCrossed size={22} />
                        </div>
                        <div className={styles.actionText}>
                            <p className={styles.actionTitle}>메뉴 관리</p>
                            <p className={styles.actionDesc}>메뉴 목록 보기</p>
                        </div>
                    </Link>

                    <Link href="/admin/orders" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <ShoppingBag size={22} />
                        </div>
                        <div className={styles.actionText}>
                            <p className={styles.actionTitle}>주문 확인</p>
                            <p className={styles.actionDesc}>새 주문 3건</p>
                        </div>
                    </Link>

                    <Link href="/admin/settings" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Settings size={22} />
                        </div>
                        <div className={styles.actionText}>
                            <p className={styles.actionTitle}>카페 설정</p>
                            <p className={styles.actionDesc}>정보 수정</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
