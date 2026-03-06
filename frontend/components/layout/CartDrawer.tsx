"use client";

import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getImageSrc } from '@/lib/api';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const {
        items,
        isCartOpen,
        setCartOpen,
        updateQuantity,
        removeItem,
        totalCount,
        totalPrice,
        clearCart
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className={styles.overlay} onClick={() => setCartOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <ShoppingBag size={20} className={styles.bagIcon} />
                        <h2>장바구니 <span>({items.length})</span></h2>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
                        <X size={24} />
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
                                        {item.image ? (
                                            <Image
                                                src={getImageSrc(item.image)}
                                                alt={item.korName}
                                                width={60}
                                                height={60}
                                                className={styles.img}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className={styles.placeholderImg}>☕</div>
                                        )}
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
                            <button className={styles.orderBtn}>주문하기 💜</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
