"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { fetchAPI } from '../lib/api';

export interface CartItem {
    id: string;           // 로그인: cart_items DB PK, 비로그인: 자동 생성 키
    menuId?: number;      // 메뉴 ID (서버에서 반환)
    korName: string;
    engName: string;
    price: number;        // 옵션 포함 최종 단가
    quantity: number;
    image?: string;
    imageSrc?: string;
    selectedOptionNames?: string[];  // 선택한 옵션 이름들
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string; menuId?: number }) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalCount: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * 비회원 장바구니 키 생성: menuId + 옵션 조합으로 유일한 키
 * 같은 메뉴라도 옵션이 다르면 별도 항목
 */
function generateCartKey(menuId: string | number, optionNames?: string[]): string {
    const base = String(menuId);
    if (!optionNames || optionNames.length === 0) return `local-${base}`;
    const optionKey = [...optionNames].sort().join('|');
    return `local-${base}-${optionKey}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // Initial load: either from API if user exists, or from localStorage
    useEffect(() => {
        if (isLoading) return;
        
        const loadCart = async () => {
            if (user) {
                try {
                    // 1. 비회원 장바구니 → 서버 마이그레이션
                    const savedCart = localStorage.getItem('ncafe-cart');
                    if (savedCart) {
                        const guestItems: CartItem[] = JSON.parse(savedCart);
                        if (guestItems.length > 0) {
                            for (const item of guestItems) {
                                const menuId = item.menuId || parseInt(item.id);
                                await fetchAPI('/cart/items', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        menuId, 
                                        quantity: item.quantity,
                                        unitPrice: item.price,
                                        selectedOptionNames: item.selectedOptionNames || null
                                    })
                                });
                            }
                        }
                        localStorage.removeItem('ncafe-cart');
                        toast.success('비회원님이 담으셨던 메뉴를 장바구니에 합쳤어몽! 💜');
                    }

                    // 2. 서버 장바구니 동기화
                    const data = await fetchAPI('/cart');
                    setItems(data || []);
                } catch (error) {
                    console.error("Failed to sync/fetch cart from server:", error);
                }
            } else {
                const savedCart = localStorage.getItem('ncafe-cart');
                if (savedCart) {
                    try {
                        setItems(JSON.parse(savedCart));
                    } catch (e) {
                        console.error('Failed to load local cart', e);
                    }
                } else {
                    setItems([]);
                }
            }
            setIsCartLoaded(true);
        };
        
        loadCart();
    }, [user, isLoading]);

    // 비회원일 때만 localStorage에 저장
    useEffect(() => {
        if (isCartLoaded && !user) {
            localStorage.setItem('ncafe-cart', JSON.stringify(items));
        }
    }, [items, user, isCartLoaded]);

    const addItem = async (newItem: Omit<CartItem, 'quantity' | 'id'> & { id?: string; menuId?: number }) => {
        const menuId = newItem.menuId || parseInt(newItem.id || '0');

        if (user) {
            // 로그인 상태: 서버에 추가 후 전체 동기화
            try {
                await fetchAPI('/cart/items', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        menuId, 
                        quantity: 1,
                        unitPrice: newItem.price,
                        selectedOptionNames: newItem.selectedOptionNames || null
                    })
                });
                // 서버에서 최신 상태 다시 가져오기 (DB PK 포함)
                const data = await fetchAPI('/cart');
                setItems(data || []);
            } catch(e) {
                console.error("Failed to sync add item to cart API:", e);
            }
        } else {
            // 비로그인: localStorage 기반, 같은 메뉴+옵션이면 수량 증가
            const cartKey = generateCartKey(menuId, newItem.selectedOptionNames);
            setItems(prev => {
                const existingItem = prev.find(item => item.id === cartKey);
                if (existingItem) {
                    return prev.map(item =>
                        item.id === cartKey
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { 
                    ...newItem, 
                    id: cartKey,
                    menuId,
                    quantity: 1 
                }];
            });
        }

        toast.success(`${newItem.korName}을(를) 담았어요! 💜`);
    };

    const removeItem = async (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        if (user) {
            try {
                await fetchAPI(`/cart/items/${id}`, { method: 'DELETE' });
            } catch(e) {
                console.error("Failed to delete cart item API", e);
            }
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
        
        if (user) {
            try {
                await fetchAPI(`/cart/items/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity })
                });
            } catch(e) {
                console.error("Failed to update cart quantity API", e);
            }
        }
    };

    const clearCart = async () => {
        setItems([]);
        if (user) {
            try {
                await fetchAPI(`/cart`, { method: 'DELETE' });
            } catch(e) {
                console.error("Failed to clear cart API", e);
            }
        }
    };

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalCount,
            totalPrice,
            isCartOpen,
            setCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
