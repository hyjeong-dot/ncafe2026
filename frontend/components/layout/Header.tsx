"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, LogIn, LogOut, User, UserPlus, Menu, X } from "lucide-react";
import Image from "next/image";
import styles from "./layout.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
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

                <button 
                    className={styles.mobileMenuBtn} 
                    onClick={toggleMobileMenu}
                    aria-label="메뉴 열기"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
                    <Link href="/#about" className={styles.navLink} onClick={closeMobileMenu}>카페 소개</Link>
                    <Link href="/#menu" className={styles.navLink} onClick={closeMobileMenu}>특별 메뉴</Link>
                    <Link href="/#special" className={styles.navLink} onClick={closeMobileMenu}>즐길거리</Link>
                    <Link href="/#reviews" className={styles.navLink} onClick={closeMobileMenu}>고객 후기</Link>
                    <Link href="/menus" className={styles.navLink} onClick={closeMobileMenu}>전체 메뉴</Link>

                    <div className={styles.buttonGroup}>
                        {user ? (
                            <>
                                <Link href="/logout" className={styles.loginButton} onClick={closeMobileMenu}>
                                    <LogOut size={16} />
                                    <span>로그아웃</span>
                                </Link>
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
                </nav>
            </div>
        </header>
    );
}
