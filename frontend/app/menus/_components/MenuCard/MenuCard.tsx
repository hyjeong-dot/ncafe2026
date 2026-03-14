import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';
import { getImageSrc } from '@/lib/api';

interface MenuCardProps {
    menu: MenuResponse;
    onLoad?: () => void;
}

/**
 * 표준 메뉴 카드 컴포넌트
 * 백엔드 DTO(MenuResult, FavoriteMenuResult 등)가 통일되어 이제 매우 단순한 구조를 유지합니다.
 */
export default function MenuCard({ menu, onLoad }: MenuCardProps) {
    const imageSrc = getImageSrc(menu.imageSrc);

    return (
        <Link href={`/menus/${menu.slug}`} className={`${styles.card} ${menu.isSoldOut ? styles.soldOut : ''}`}>
            <div className={styles.imageWrapper}>
                <Image
                    src={imageSrc}
                    alt={menu.korName}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onLoad={() => onLoad?.()}
                    onError={() => onLoad?.()}
                />

                {menu.isSoldOut && (
                    <div className={styles.soldOutOverlay}>
                        <span className={styles.soldOutBadge}>품절 😢</span>
                    </div>
                )}

                <span className={styles.categoryBadge}>
                    {menu.categoryIcon} {menu.categoryName}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.korName}>{menu.korName}</h3>
                <p className={styles.engName}>{menu.engName}</p>
                {menu.description && (
                    <p className={styles.description}>{menu.description}</p>
                )}
                <div className={styles.priceRow}>
                    <span className={styles.price}>₩{menu.price?.toLocaleString()}</span>
                </div>
            </div>
        </Link>
    );
}
