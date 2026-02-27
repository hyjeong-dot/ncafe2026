import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';

interface MenuCardProps {
    menu: MenuResponse;
    onLoad?: () => void;
}

export default function MenuCard({ menu, onLoad }: MenuCardProps) {
    useEffect(() => {
        // 이미지가 아예 없는 경우 부모에게 완료를 즉시 알림
        if (!menu.imageSrc || menu.imageSrc === 'blank.png') {
            onLoad?.();
        }
    }, [menu.imageSrc, onLoad]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <Link href={`/menus/${menu.id}`} className={`${styles.card} ${menu.isSoldOut ? styles.soldOut : ''}`}>
            {/* Image */}
            <div className={styles.imageWrapper}>
                {menu.imageSrc && menu.imageSrc !== 'blank.png' ? (
                    <Image
                        src={menu.imageSrc}
                        alt={menu.korName}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onLoad={() => onLoad?.()}
                        onError={() => onLoad?.()}
                    />
                ) : (
                    <div className={styles.noImage}>
                        <ImageIcon size={40} />
                        <span>준비 중</span>
                    </div>
                )}

                {menu.isSoldOut && (
                    <div className={styles.soldOutOverlay}>
                        <span className={styles.soldOutBadge}>품절 😢</span>
                    </div>
                )}

                <span className={styles.categoryBadge}>
                    {menu.categoryIcon} {menu.categoryName}
                </span>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.korName}>{menu.korName}</h3>
                <p className={styles.engName}>{menu.engName}</p>
                {menu.description && (
                    <p className={styles.description}>{menu.description}</p>
                )}
                <div className={styles.priceRow}>
                    <span className={styles.price}>₩{formatPrice(menu.price)}</span>
                </div>
            </div>
        </Link>
    );
}
