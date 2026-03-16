'use client';

import { PopularMenu } from './useAnalytics';
import styles from '../page.module.css';

interface PopularMenuRankProps {
    menus: PopularMenu[];
}

export default function PopularMenuRank({ menus }: PopularMenuRankProps) {
    const maxQty = menus[0]?.totalQuantity || 1;

    return (
        <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>🏆 인기 메뉴 TOP 5</h2>
            <div className={styles.rankList}>
                {menus.length === 0 ? (
                    <div className={styles.emptyRank}>아직 주문 데이터가 없어요.</div>
                ) : (
                    menus.map((menu, idx) => (
                        <div key={idx} className={styles.rankItem}>
                            <span className={styles.rankNum}>
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                            </span>
                            <div className={styles.rankInfo}>
                                <span className={styles.rankName}>{menu.menuName}</span>
                                <div className={styles.rankBarOuter}>
                                    <div
                                        className={styles.rankBarInner}
                                        style={{ width: `${(menu.totalQuantity / maxQty) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className={styles.rankStats}>
                                <span className={styles.rankQty}>{menu.totalQuantity}잔</span>
                                <span className={styles.rankRev}>₩{menu.totalRevenue.toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
