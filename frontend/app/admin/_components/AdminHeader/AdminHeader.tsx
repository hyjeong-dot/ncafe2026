'use client';

import { Bell, Search } from 'lucide-react';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
    title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.pageTitle}>{title}</h1>
            </div>

            <div className={styles.right}>
                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="메뉴, 주문 검색..."
                        className={styles.searchInput}
                    />
                </div>

                <button className={styles.iconButton}>
                    <Bell size={20} />
                    <span className={styles.notificationDot} />
                </button>
            </div>
        </header>
    );
}
