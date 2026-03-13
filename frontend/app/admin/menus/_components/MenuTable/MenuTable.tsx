'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './MenuTable.module.css';
import { MenuResponse } from '../MenuGrid/useMenus';
import { getImageSrc } from '@/lib/api';

interface MenuTableProps {
    menus: MenuResponse[];
    onToggleSoldOut: (menuId: string) => void;
    onDelete: (menuId: string) => void;
}

export default function MenuTable({ menus, onToggleSoldOut, onDelete }: MenuTableProps) {
    const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.thNum}>#</th>
                        <th className={styles.thImage}>이미지</th>
                        <th className={styles.thName}>메뉴명</th>
                        <th className={styles.thCategory}>카테고리</th>
                        <th className={styles.thPrice}>가격</th>
                        <th className={styles.thStatus}>상태</th>
                        <th className={styles.thOptions}>옵션</th>
                        <th className={styles.thActions}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map((menu, index) => (
                        <tr
                            key={menu.id}
                            className={`${styles.row} ${menu.isSoldOut ? styles.soldOutRow : ''}`}
                        >
                            <td className={styles.num}>{index + 1}</td>
                            <td className={styles.imageCell}>
                                <Link href={`/admin/menus/${menu.id}`} className={styles.imageLink}>
                                    <div className={styles.imageBox}>
                                        <Image
                                            src={getImageSrc(menu.imageSrc)}
                                            alt={menu.korName}
                                            fill
                                            className={styles.img}
                                            sizes="40px"
                                        />
                                    </div>
                                </Link>
                            </td>
                            <td className={styles.nameCell}>
                                <Link href={`/admin/menus/${menu.id}`} className={styles.nameLink}>
                                    <span className={styles.korName}>{menu.korName}</span>
                                    <span className={styles.engName}>{menu.engName}</span>
                                </Link>
                            </td>
                            <td className={styles.category}>
                                <span className={styles.categoryBadge}>
                                    {menu.categoryIcon} {menu.categoryName}
                                </span>
                            </td>
                            <td className={styles.price}>₩{formatPrice(menu.price)}</td>
                            <td className={styles.status}>
                                <button
                                    className={`${styles.statusBadge} ${menu.isSoldOut ? styles.soldOut : styles.available}`}
                                    onClick={() => onToggleSoldOut(String(menu.id))}
                                    title={menu.isSoldOut ? '품절 해제' : '품절 처리'}
                                >
                                    {menu.isSoldOut ? '품절' : '판매중'}
                                </button>
                            </td>
                            <td className={styles.options}>
                                {(menu as any).options?.length > 0 ? (
                                    <span className={styles.optionCount}>{(menu as any).options.length}개</span>
                                ) : (
                                    <span className={styles.noOption}>—</span>
                                )}
                            </td>
                            <td className={styles.actions}>
                                <Link
                                    href={`/admin/menus/${menu.id}`}
                                    className={styles.actionBtn}
                                    title="수정"
                                >
                                    <Edit2 size={15} />
                                </Link>
                                <button
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    onClick={() => onDelete(String(menu.id))}
                                    title="삭제"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
