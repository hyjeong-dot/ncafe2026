'use client';

import { Heart, Share2, Info, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { useMenuDetail } from './useMenuDetail';

interface MenuDetailInfoProps {
    id: number;
}

export default function MenuDetailInfo({ id }: MenuDetailInfoProps) {
    const { menu, isLoading, error } = useMenuDetail(id);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    if (isLoading) return <div className={styles.loading}>정보를 불러오는 중...</div>;
    if (error || !menu) return null;

    return (
        <div className={styles.info}>
            <div className={styles.categoryInfo}>
                <span className={styles.categoryBadge}>
                    {menu.categoryIcon} {menu.categoryName}
                </span>
            </div>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>{menu.korName}</h1>
                <div className={styles.actionIcons}>
                    <button className={styles.iconBtn}><Heart size={20} /></button>
                    <button className={styles.iconBtn}><Share2 size={20} /></button>
                </div>
            </div>
            <p className={styles.engTitle}>{menu.engName}</p>

            <div className={styles.priceSection}>
                <span className={styles.price}>₩{formatPrice(menu.price)}</span>
            </div>

            <div className={styles.descSection}>
                <h3 className={styles.sectionTitle}><Info size={16} /> 메뉴 설명</h3>
                <p className={styles.description}>{menu.description || '준비된 설명이 없습니다.'}</p>
            </div>

            <div className={styles.extraInfo}>
                <div className={styles.infoItem}>
                    <Clock size={16} />
                    <span>평균 준비 시간: 10분</span>
                </div>
                <div className={styles.infoItem}>
                    <Sparkles size={16} />
                    <span>메타몽의 추천 당도: 70%</span>
                </div>
            </div>

            <div className={styles.ctaRow}>
                <button className={styles.cartBtn} disabled={menu.isSoldOut}>
                    <ShoppingBag size={20} />
                    <span>장바구니</span>
                </button>
                <button className={styles.mainCta} disabled={menu.isSoldOut}>
                    {menu.isSoldOut ? '현재 준비 중입니다' : '주문하기 💜'}
                </button>
            </div>
        </div>
    );
}
