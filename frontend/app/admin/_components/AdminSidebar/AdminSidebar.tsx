'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    X,
    LucideIcon,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

const navItems: NavGroup[] = [
    {
        group: '메인',
        items: [
            { href: '/admin', label: '대시보드', icon: LayoutDashboard },
        ],
    },
    {
        group: '메뉴 관리',
        items: [
            { href: '/admin/menus', label: '메뉴 목록', icon: UtensilsCrossed },
        ],
    },
    {
        group: '주문',
        items: [
            { href: '/admin/orders', label: '주문 관리', icon: ShoppingBag, badge: 3 },
        ],
    },
    {
        group: '설정',
        items: [
            { href: '/admin/settings', label: '카페 설정', icon: Settings },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    // 페이지 이동 시 사이드바 닫기
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // 사이드바 열려있을 때 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* 모바일 햄버거 버튼 */}
            <button
                className={styles.hamburger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 배경 오버레이 (모바일에서 사이드바 열리면 표시) */}
            {isOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>💜</div>
                    <div className={styles.logoText}>
                        메타몽 카페
                        <span className={styles.logoSubtext}>Admin</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {navItems.map((group) => (
                        <div key={group.group} className={styles.navGroup}>
                            <div className={styles.navGroupTitle}>{group.group}</div>
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                    >
                                        <Icon className={styles.navIcon} />
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span className={styles.navBadge}>{item.badge}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* User Section */}
                <div className={styles.userSection}>
                    <div className={styles.userAvatar}>정</div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>정사장님</div>
                        <div className={styles.userRole}>카페 관리자</div>
                    </div>
                    <button className={styles.settingsButton} title="로그아웃" onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/';
                    }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
