import { TrendingUp, Star } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { Menu } from '@/types/menu';

export default function MenuDetailInfo() {
    // Mock Data (Fixed values to prevent hydration mismatch)
    const mockStats = {
        todaySales: 32,
        totalSales: 847,
        rating: '4.7',
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    return (
        <section className={styles.infoSection}>
            <div className={styles.titleArea}>
                <div className={styles.statusBadges}>
                </div>
                <span className={styles.categoryBadge}>
                </span>
                <h1 className={styles.korName}>메뉴 이름</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <p className={styles.engName} style={{ marginBottom: 0 }}>메뉴 영문명</p>
                    <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#6b7280', alignItems: 'center' }}>
                        <span>dev_admin</span>
                        <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
                        <span>2024.01.15</span>
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
                        {formatPrice(mockStats.todaySales * 10000)}원
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
                <span className={styles.price}>{formatPrice(10000)}원</span>
            </div>

            <div className={styles.description}>
                메뉴 설명이 없습니다.
            </div>
        </section>
    );

    // return (
    //     <section className={styles.infoSection}>
    //         <div className={styles.titleArea}>
    //             <div className={styles.statusBadges}>
    //                 {menu.isSoldOut ? (
    //                     <span className={`${styles.badge} ${styles.soldOut}`}>품절</span>
    //                 ) : (
    //                     <span className={`${styles.badge} ${styles.available}`}>판매중</span>
    //                 )}
    //             </div>
    //             <span className={styles.categoryBadge}>
    //                 {menu.category.icon} {menu.category.korName}
    //             </span>
    //             <h1 className={styles.korName}>{menu.korName}</h1>
    //             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
    //                 <p className={styles.engName} style={{ marginBottom: 0 }}>{menu.engName}</p>
    //                 <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
    //                 <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#6b7280', alignItems: 'center' }}>
    //                     <span>dev_admin</span>
    //                     <span style={{ color: '#e5e7eb', fontSize: '12px' }}>|</span>
    //                     <span>2024.01.15</span>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Sales Dashboard */}
    //         <div className={styles.dashboardGrid}>
    //             <div className={styles.statCard}>
    //                 <span className={styles.statLabel}>오늘 판매량</span>
    //                 <span className={styles.statValue}>{mockStats.todaySales}잔</span>
    //                 <span className={`${styles.statTrend} ${styles.trendUp}`}>
    //                     <TrendingUp size={12} /> +12%
    //                 </span>
    //             </div>
    //             <div className={styles.statCard}>
    //                 <span className={styles.statLabel}>예상 매출</span>
    //                 <span className={styles.statValue}>
    //                     {formatPrice(mockStats.todaySales * menu.price)}원
    //                 </span>
    //             </div>
    //             <div className={styles.statCard}>
    //                 <span className={styles.statLabel}>고객 평점</span>
    //                 <span className={styles.statValue}>★ {mockStats.rating}</span>
    //                 <span className={styles.statTrend} style={{ color: '#fbbf24' }}>
    //                     <Star size={12} fill="#fbbf24" /> 4.8 (120)
    //                 </span>
    //             </div>
    //         </div>

    //         <div className={styles.priceArea}>
    //             <span className={styles.priceLabel}>판매가</span>
    //             <span className={styles.price}>{formatPrice(menu.price)}원</span>
    //         </div>

    //         <div className={styles.description}>
    //             {menu.description || '메뉴 설명이 없습니다.'}
    //         </div>
    //     </section>
    // );
}
