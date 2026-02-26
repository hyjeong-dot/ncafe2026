"use client";

import Link from "next/link";
import { Settings, LogIn } from "lucide-react";
import styles from "./layout.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`${styles.container} ${styles.headerInner}`}>
                <Link href="/" className={styles.logoArea}>
                    <span className={styles.logoEmoji}>💜</span>
                    <span>메타몽 카페</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/#about" className={styles.navLink}>카페 소개</Link>
                    <Link href="/#menu" className={styles.navLink}>특별 메뉴</Link>
                    <Link href="/#special" className={styles.navLink}>즐길거리</Link>
                    <Link href="/#reviews" className={styles.navLink}>고객 후기</Link>
                    <Link href="/menus" className={styles.navLink}>전체 메뉴</Link>

                    <div className={styles.buttonGroup}>
                        <Link href="/login" className={styles.loginButton}>
                            <LogIn size={16} />
                            <span>로그인</span>
                        </Link>
                        <Link href="/admin" className={styles.adminButton}>
                            <Settings size={14} />
                            <span>관리자</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
