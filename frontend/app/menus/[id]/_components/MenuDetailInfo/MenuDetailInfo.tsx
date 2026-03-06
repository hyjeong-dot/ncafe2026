'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Heart, Share2, Info, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { useMenuDetail } from './useMenuDetail';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { fetchAPI } from '@/lib/api';
import Modal from '@/components/common/Modal/Modal';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';

interface MenuDetailInfoProps {
    id: number;
}

export default function MenuDetailInfo({ id }: MenuDetailInfoProps) {
    const { menu, isLoading, error } = useMenuDetail(id);
    const { user } = useAuth();
    const { addItem } = useCart();
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Initial check on mount or when menu/user changes
    useEffect(() => {
        if (user && menu) {
            fetch(`${window.location.origin}/api/favorites/${menu.id}/check`)
                .then(res => res.json())
                .then(data => setIsLiked(data.isFavorite))
                .catch(err => console.error("Error checking favorite:", err));
        }
    }, [user, menu]);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success("주소가 복사되었어요! 💜");
        }
    };

    const handleLike = async () => {
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        try {
            const result = await fetchAPI(`/favorites`, {
                method: 'POST',
                body: JSON.stringify({ menuId: menu?.id })
            });
            
            const newLikedState = result.isFavorite;
            setIsLiked(newLikedState);
            
            if (newLikedState) {
                toast.success("찜 목록에 담았어요! 마이페이지에서 확인해 보세요 🍮", {
                    icon: '💜',
                });
            } else {
                toast("찜 목록에서 제외했습니다.", {
                    icon: '🤍',
                });
            }
        } catch (err) {
            console.error("Failed to toggle interest:", err);
            toast.error("처리 중 오류가 발생했습니다.");
        }
    };

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

    if (isLoading) return <LoadingDitto message="정보를 불러오는 중..." />;
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
                    <button 
                        className={`${styles.iconBtn} ${isLiked ? styles.liked : ''}`}
                        onClick={handleLike}
                        aria-label="좋아요"
                    >
                        <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button 
                        className={styles.iconBtn}
                        onClick={handleShare}
                        aria-label="공유하기"
                    >
                        <Share2 size={22} />
                    </button>
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
                    onClick={() => {
                        addItem({
                            id: menu.id.toString(),
                            korName: menu.korName,
                            engName: menu.engName,
                            price: menu.price,
                            image: menu.imageSrc
                        });
                    }}
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
