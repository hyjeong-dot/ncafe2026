import { TrendingUp, Star } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { Menu } from '@/types/menu';
import { useMenuDetail } from './useMenuDetail';

export default function MenuDetailInfo({ id }: { id: number }) {
    const { menu, isLoading, error } = useMenuDetail(id);

    // Mock Data for analytics (placeholder)
    const mockStats = {
        todaySales: 32,
        totalSales: 847,
        rating: '4.7',
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!menu) return <div>Menu not found</div>;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <section className={styles.infoSection}>
            <div className={styles.titleArea}>
                <div className={styles.statusBadges}>
                    {menu.isAvailable ? (
                        <span className={`${styles.badge} ${styles.available}`}>판매중</span>
                    ) : (
                        <span className={`${styles.badge} ${styles.soldOut}`}>품절</span>
                    )}
                </div>
                <span className={styles.categoryBadge}>
                    {menu.categoryName}
                </span>
                <h1 className={styles.korName}>{menu.korName}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <p className={styles.engName} style={{ marginBottom: 0 }}>{menu.engName}</p>
                    <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#6b7280', alignItems: 'center' }}>
                        <span>작성자 ADMIN</span>
                        <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
                        <span>등록일 {menu.createdAt ? formatDate(menu.createdAt) : '-'}</span>
                        <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
                        <span>수정일 {menu.updatedAt ? formatDate(menu.updatedAt) : '-'}</span>
                    </div>
                </div>
            </div>

            {/* Sales Dashboard */}
            <div className={styles.dashboardGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>오늘 판매량</span>
                    <span className={styles.statValue}>{mockStats.todaySales}잔</span>
                    <span className={`${styles.statTrend} ${styles.trendUp}`}>
                        <TrendingUp size={12} /> +12%
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>예상 매출</span>
                    <span className={styles.statValue}>
                        {formatPrice(mockStats.todaySales * menu.price)}원
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>고객 평점</span>
                    <span className={styles.statValue}>★ {mockStats.rating}</span>
                    <span className={styles.statTrend} style={{ color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" /> 4.8 (120)
                    </span>
                </div>
            </div>

            <div className={styles.priceArea}>
                <span className={styles.priceLabel}>판매가</span>
                <span className={styles.price}>{formatPrice(menu.price)}원</span>
            </div>

            <div className={styles.description}>
                {menu.description || '메뉴 설명이 없습니다.'}
            </div>
        </section>
    );

}
