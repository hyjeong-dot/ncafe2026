'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, Info, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { useMenuDetail } from './useMenuDetail';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/common/Modal/Modal';

interface MenuDetailInfoProps {
    id: number;
}

export default function MenuDetailInfo({ id }: MenuDetailInfoProps) {
    const { menu, isLoading, error } = useMenuDetail(id);
    const { user } = useAuth();
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const handleAction = (action: () => void) => {
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }
        action();
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
                <button
                    className={styles.cartBtn}
                    disabled={menu.isSoldOut}
                    onClick={() => handleAction(() => {
                        setIsCartModalOpen(true);
                    })}
                >
                    <ShoppingBag size={20} />
                    <span>장바구니</span>
                </button>
                <button
                    className={styles.mainCta}
                    disabled={menu.isSoldOut}
                    onClick={() => handleAction(() => {
                        setIsOrderModalOpen(true);
                    })}
                >
                    {menu.isSoldOut ? '현재 준비 중입니다' : '주문하기 💜'}
                </button>
            </div>

            {/* 로그인 필요 모달 */}
            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="로그인이 필요해요 💜"
                description="메타몽 바리스타가 사장님을 기다리고 있어요! 로그인하고 맛있는 메뉴를 주문하시겠어요?"
                confirmText="로그인하러 가기"
                cancelText="나중에 할게요"
                onConfirm={() => router.push('/login')}
                variant="ditto"
            />

            {/* 장바구니 담기 모달 */}
            <Modal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                title="장바구니에 담았어요! 🛍️"
                description={`${menu.korName}이(가) 장바구니에 담겼어요 💜 메타몽이 잘 보관해 드릴게요!`}
                confirmText="장바구니로 가기"
                cancelText="계속 쇼핑하기"
                onConfirm={() => {
                    setIsCartModalOpen(false);
                    router.push('/cart');
                }}
                variant="ditto"
            />

            {/* 주문하기 모달 */}
            <Modal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                title="주문을 진행할게요! ☕"
                description={`${menu.korName} 주문 페이지로 이동합니다. 메타몽이 정성껏 준비해 드릴게요! 💜`}
                confirmText="주문 페이지로 이동"
                cancelText="취소"
                onConfirm={() => {
                    setIsOrderModalOpen(false);
                    // TODO: 실제 주문 페이지 라우팅
                }}
                variant="ditto"
            />
        </div>
    );
}
