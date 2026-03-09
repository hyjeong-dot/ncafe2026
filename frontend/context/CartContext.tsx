"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { fetchAPI } from '../lib/api';

export interface CartItem {
    id: string; // backend returns menuId as id
    korName: string;
    engName: string;
    price: number;
    quantity: number;
    image?: string;
    imageSrc?: string; // For backward compatibility with server response
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalCount: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // Initial load: either from API if user exists, or from localStorage
    useEffect(() => {
        if (isLoading) return; // wait till auth is checked
        
        const loadCart = async () => {
            if (user) {
                try {
                    const data = await fetchAPI('/cart');
                    setItems(data || []);
                } catch (error) {
                    console.error("Failed to fetch cart from server:", error);
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

    // Save strictly to localStorage whenever it changes IF NO USER
    useEffect(() => {
        if (isCartLoaded && !user) {
            localStorage.setItem('ncafe-cart', JSON.stringify(items));
        }
    }, [items, user, isCartLoaded]);

    const addItem = async (newItem: Omit<CartItem, 'quantity'>) => {
        // update local state first for optimistic UI response
        setItems(prev => {
            const existingItem = prev.find(item => item.id === newItem.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });

        if (user) {
            try {
                await fetchAPI('/cart/items', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ menuId: parseInt(newItem.id), quantity: 1 })
                });
            } catch(e) {
                console.error("Failed to sync add item to cart API:", e);
                // In a perfect world, rollback state if fails. Assuming optimistic works.
            }
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
