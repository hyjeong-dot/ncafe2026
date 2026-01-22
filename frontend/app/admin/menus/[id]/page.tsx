'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Edit2,
    Trash2,
    ImageIcon,
    Activity,
    Zap,
    Droplet,
    Cpu,
    TrendingUp,
    Star,
    QrCode,
    Clock
} from 'lucide-react';
import { useMenuStore } from '@/stores/menuStore';
import styles from './page.module.css';
import { use } from 'react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';

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

    // Mock Data (Fixed values to prevent hydration mismatch)
    const mockStats = {
        todaySales: 32,
        totalSales: 847,
        rating: '4.7',
    };

    const mockNutrition = {
        calories: 185,
        sugars: 24,
        protein: 5,
        caffeine: 95,
    };

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
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast('QR코드가 생성되었습니다 (Mock)', { icon: '📱' })}
                    >
                        <QrCode size={16} />
                        키오스크 미리보기
                    </Button>
                </div>
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

                    {/* Nutrition Info (New) */}
                    <div className={styles.nutritionGrid} style={{ marginTop: '1.5rem' }}>
                        <div className={styles.nutritionItem}>
                            <div className={styles.nutritionIcon}><Activity size={16} /></div>
                            <div className={styles.nutritionInfo}>
                                <span className={styles.nutritionLabel}>칼로리</span>
                                <span className={styles.nutritionValue}>{mockNutrition.calories} kcal</span>
                            </div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div className={styles.nutritionIcon}><Zap size={16} /></div>
                            <div className={styles.nutritionInfo}>
                                <span className={styles.nutritionLabel}>카페인</span>
                                <span className={styles.nutritionValue}>{mockNutrition.caffeine} mg</span>
                            </div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div className={styles.nutritionIcon}><Droplet size={16} /></div>
                            <div className={styles.nutritionInfo}>
                                <span className={styles.nutritionLabel}>당류</span>
                                <span className={styles.nutritionValue}>{mockNutrition.sugars} g</span>
                            </div>
                        </div>
                        <div className={styles.nutritionItem}>
                            <div className={styles.nutritionIcon}><Cpu size={16} /></div>
                            <div className={styles.nutritionInfo}>
                                <span className={styles.nutritionLabel}>단백질</span>
                                <span className={styles.nutritionValue}>{mockNutrition.protein} g</span>
                            </div>
                        </div>
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

                    {/* Sales Dashboard (New) */}
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
                    {/* Meta Info (New) */}
                    <div className={styles.metaInfo}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> 최초 등록일: 2024.01.15
                        </div>
                        <div>최근 수정: 방금 전</div>
                        <div>관리자: dev_admin</div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions} style={{ marginTop: '0', paddingTop: '0', border: 'none' }}>
                        <Link href={`/admin/menus/${menu.id}/edit`} style={{ width: '100%' }}>
                            <Button variant="primary" size="lg" className={styles.fullWidthButton} style={{ width: '100%' }}>
                                <Edit2 size={20} />
                                메뉴 수정하기
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={handleDeleteClick}
                            style={{ minWidth: '140px' }}
                        >
                            <Trash2 size={20} />
                            삭제
                        </Button>
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
