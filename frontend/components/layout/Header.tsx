"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, LogIn, LogOut, User, UserPlus, Menu, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import styles from "./layout.module.css";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
    const { user, logout } = useAuth();
    const { totalCount, setCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={`${styles.container} ${styles.headerInner}`}>
                <Link href="/" className={styles.logoArea} onClick={closeMobileMenu}>
                    <Image
                        src="/images/ditto/favicon-ditto.png"
                        alt="Ditto Logo"
                        width={32}
                        height={32}
                        className={styles.logoImage}
                    />
                    <span>메타몽 카페</span>
                </Link>



                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
                    <div className={styles.actionNav}>
                        <button 
                            className={styles.desktopCartBtn}
                            onClick={() => {
                                setCartOpen(true);
                                if (isMobileMenuOpen) closeMobileMenu();
                            }}
                            aria-label="장바구니 열기"
                        >
                            <ShoppingBag size={22} />
                            {totalCount > 0 && <span className={styles.cartBadge}>{totalCount}</span>}
                        </button>
                        
                        <Link href="/menus" className={styles.navLink} onClick={closeMobileMenu}>전체 메뉴</Link>

                        <div className={styles.buttonGroup}>
                            {user ? (
                                <>
                                    <button onClick={() => { logout(); closeMobileMenu(); }} className={styles.loginButton}>
                                        <LogOut size={16} />
                                        <span>로그아웃</span>
                                    </button>
                                    <Link href={user.role === 'ROLE_ADMIN' ? '/admin' : '/mypage'} className={styles.adminButton} onClick={closeMobileMenu}>
                                        <User size={14} />
                                        <span>{user.username}</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.loginButton} onClick={closeMobileMenu}>
                                        <LogIn size={16} />
                                        <span>로그인</span>
                                    </Link>
                                    <Link href="/signup" className={styles.adminButton} onClick={closeMobileMenu}>
                                        <UserPlus size={14} />
                                        <span>회원가입</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className={styles.mobileActions}>
                    <button 
                        className={styles.cartButton}
                        onClick={() => setCartOpen(true)}
                        aria-label="장바구니 열기"
                    >
                        <ShoppingBag size={24} />
                        {totalCount > 0 && <span className={styles.cartBadge}>{totalCount}</span>}
                    </button>

                    <button 
                        className={styles.mobileMenuBtn} 
                        onClick={toggleMobileMenu}
                        aria-label="메뉴 열기"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
