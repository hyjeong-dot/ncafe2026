'use client';

import { useDashboardStats } from './_components/useDashboardStats';
import styles from './page.module.css';

// Dashboard Components
import DashboardHeader from './_components/DashboardHeader';
import DashboardStats from './_components/DashboardStats';
import DashboardActions from './_components/DashboardActions';
import DashboardLoading from './_components/DashboardLoading';

/**
 * 어드민 대시보드 메인
 * 헤더, 통계, 빠른 작업 섹션으로 컴포넌트화되었습니다.
 */
export default function AdminDashboard() {
    const { stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <div className={styles.container}>
            {/* 1. 환영 헤더 섹션 */}
            <DashboardHeader />

            {/* 2. 통계 카드 그리드 섹션 */}
            <DashboardStats stats={stats} />

            {/* 3. 단축 메뉴 섹션 */}
            <DashboardActions />
        </div>
    );
}
