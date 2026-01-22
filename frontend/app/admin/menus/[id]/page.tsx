'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, ImageIcon } from 'lucide-react';
import { useMenuStore } from '@/stores/menuStore';
import styles from './page.module.css';
import { use } from 'react';
import Modal from '@/components/common/Modal/Modal';

// Next.js 15+ compatible props type
interface MenuDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Use Zustand store for menu data
    const menu = useMenuStore((state) => state.getMenuById(id));
    const deleteMenuFromStore = useMenuStore((state) => state.deleteMenu);

    // If deleting, show nothing (will redirect soon)
    if (isDeleting) {
        return null;
    }

    if (!menu) {
        notFound();
    }

    const primaryImage = menu.images.find((img) => img.isPrimary) || menu.images[0];

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        deleteMenuFromStore(id);
        toast.success('메뉴가 삭제되었습니다.');
        router.push('/admin/menus');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/menus" className={styles.backButton}>
                    <ArrowLeft size={20} />
                    <span>목록으로 돌아가기</span>
                </Link>
            </div>

            <main className={styles.content}>
                {/* Left Column: Image */}
                <section className={styles.imageSection}>
                    <div className={styles.mainImageWrapper}>
                        {primaryImage ? (
                            <Image
                                src={primaryImage.url}
                                alt={menu.korName}
                                fill
                                className={styles.mainImage}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className={styles.noImage}>
                                <ImageIcon size={64} />
                                <span>이미지가 없습니다</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Column: Info & Options */}
                <section className={styles.infoSection}>
                    <div className={styles.titleArea}>
                        <div className={styles.statusBadges}>
                            {menu.isSoldOut ? (
                                <span className={`${styles.badge} ${styles.soldOut}`}>품절</span>
                            ) : (
                                <span className={`${styles.badge} ${styles.available}`}>판매중</span>
                            )}
                        </div>
                        <span className={styles.categoryBadge}>
                            {menu.category.icon} {menu.category.korName}
                        </span>
                        <h1 className={styles.korName}>{menu.korName}</h1>
                        <p className={styles.engName}>{menu.engName}</p>
                    </div>

                    <div className={styles.priceArea}>
                        <span className={styles.priceLabel}>판매가</span>
                        <span className={styles.price}>{formatPrice(menu.price)}원</span>
                    </div>

                    <div className={styles.description}>
                        {menu.description || '메뉴 설명이 없습니다.'}
                    </div>

                    {/* Options */}
                    <div className={styles.optionsSection}>
                        <h3 className={styles.sectionTitle}>옵션 정보</h3>
                        {menu.options && menu.options.length > 0 ? (
                            menu.options.map((option) => (
                                <div key={option.id} className={styles.optionCard}>
                                    <div className={styles.optionHeader}>
                                        <span className={styles.optionName}>{option.name}</span>
                                        {option.required && (
                                            <span className={styles.requiredBadge}>필수</span>
                                        )}
                                    </div>
                                    <div className={styles.optionList}>
                                        {option.items.map((item) => (
                                            <div key={item.id} className={styles.optionItem}>
                                                <span>{item.name}</span>
                                                <span className={styles.itemPrice}>
                                                    {item.priceDelta > 0
                                                        ? `+${formatPrice(item.priceDelta)}원`
                                                        : '무료'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyOptions}>
                                등록된 옵션이 없습니다.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Link
                            href={`/admin/menus/${menu.id}/edit`}
                            className={`${styles.button} ${styles.editButton}`}
                        >
                            <Edit2 size={20} />
                            메뉴 수정하기
                        </Link>
                        <button
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={handleDeleteClick}
                        >
                            <Trash2 size={20} />
                            메뉴 삭제하기
                        </button>
                    </div>
                </section>
            </main>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
