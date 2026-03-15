"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/common/Modal/Modal';
import { getImageSrc } from '@/lib/api';
import styles from './CartDrawer.module.css';

/**
 * 장바구니 드로어
 * 백엔드 데이터와 프론트엔드 상태가 imageSrc로 통일되어 구조가 간결해졌습니다.
 */
export default function CartDrawer() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const {
        items,
        isCartOpen,
        setCartOpen,
        updateQuantity,
        removeItem,
        totalCount,
        totalPrice,
    } = useCart();

    const handleOrder = () => {
        if (!user) {
            setLoginModalOpen(true);
            return;
        }
        setCartOpen(false);
        router.push('/order');
    };

    // ESC 키로 장바구니 닫기
    useEffect(() => {
        if (!isCartOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setCartOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, setCartOpen]);

    if (!isCartOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={() => setCartOpen(false)}>
                <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <div className={styles.titleInfo}>
                            <ShoppingBag size={20} className={styles.bagIcon} />
                            <h2>장바구니 <span>({items.length})</span></h2>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
                            <X size={24} /> <kbd className={styles.kbd}>ESC</kbd>
                        </button>
                    </div>

                    <div className={styles.content}>
                        {items.length === 0 ? (
                            <div className={styles.emptyCart}>
                                <div className={styles.emptyIcon}>🍮</div>
                                <p>장바구니가 비어있어요.<br />메타몽이 기다리고 있어요!</p>
                                <Link 
                                    href="/menus" 
                                    className={styles.browseBtn}
                                    onClick={() => setCartOpen(false)}
                                >
                                    메뉴 보러가기 <ArrowRight size={16} />
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.itemList}>
                                {items.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemImage}>
                                            <Image
                                                src={getImageSrc(item.imageSrc || item.image)}
                                                alt={item.korName}
                                                fill
                                                className={styles.img}
                                                sizes="60px"
                                            />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemHeader}>
                                                <h3>{item.korName}</h3>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            {item.selectedOptionNames && item.selectedOptionNames.length > 0 && (
                                                <p className={styles.optionNames}>{item.selectedOptionNames.join(' · ')}</p>
                                            )}
                                            <p className={styles.price}>{(item.price * item.quantity).toLocaleString()}원</p>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className={styles.footer}>
                            <div className={styles.totalRow}>
                                <span>총 합계 <span className={styles.countInfo}>({totalCount}개 상품)</span></span>
                                <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                            </div>
                            <div className={styles.actionBtns}>
                                <button className={styles.orderBtn} onClick={handleOrder}>주문하기 💜</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                title="로그인이 필요해요 💜"
                description="메타몽 바리스타가 사장님을 기다리고 있어요! 로그인하고 맛있는 메뉴를 주문하시겠어요?"
                confirmText="로그인하러 가기"
                cancelText="나중에 할게요"
                onConfirm={() => {
                    setCartOpen(false);
                    router.push('/login');
                }}
                variant="ditto"
            />
        </>
    );
}
