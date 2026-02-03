'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, ImageIcon } from 'lucide-react';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';

interface MenuCardProps {
    menu: MenuResponse | null;
    onToggleSoldOut: (menuId: string) => void;
    onDelete: (menuId: string) => void;
}

export default function MenuCard({ menu, onToggleSoldOut, onDelete }: MenuCardProps) {
    const router = useRouter();

    if (!menu) return null;

    const handleCardClick = () => {
        router.push(`/admin/menus/${menu.id}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const menuIdStr = String(menu.id);

    return (
        <div
            className={`${styles.card} ${menu.isSoldOut ? styles.soldOut : ''}`}
            onClick={handleCardClick}
        >
            {/* Image */}
            <div className={styles.imageWrapper}>
                {menu.imageSrc ? (
                    <Image
                        src={menu.imageSrc}
                        alt={menu.korName}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.noImage}>
                        <ImageIcon size={48} />
                    </div>
                )}

                {menu.isSoldOut && (
                    <span className={styles.soldOutBadge}>품절</span>
                )}

                <span className={styles.categoryBadge}>
                    {menu.categoryName}
                </span>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.names}>
                        <h3 className={styles.korName}>{menu.korName}</h3>
                        <p className={styles.engName}>{menu.engName}</p>
                    </div>
                    <span className={styles.price}>₩{formatPrice(menu.price)}</span>
                </div>

                <p className={styles.description}>{menu.description}</p>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.toggleWrapper}>
                        <span className={styles.toggleLabel}>품절</span>
                        <button
                            className={`${styles.toggle} ${menu.isSoldOut ? styles.active : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSoldOut(menuIdStr);
                            }}
                            title={menu.isSoldOut ? '품절 해제' : '품절 처리'}
                        >
                            <span className={styles.toggleKnob} />
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <Link
                            href={`/admin/menus/${menu.id}`}
                            className={styles.actionButton}
                            title="상세 보기 / 수정"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Edit2 size={18} />
                        </Link>
                        <button
                            className={`${styles.actionButton} ${styles.delete}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(menuIdStr);
                            }}
                            title="삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
