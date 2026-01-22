'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Settings,
    LogOut,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

const navItems = [
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

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>☕</div>
                <div className={styles.logoText}>
                    NCafe
                    <span className={styles.logoSubtext}>Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((group) => (
                    <div key={group.group} className={styles.navGroup}>
                        <div className={styles.navGroupTitle}>{group.group}</div>
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                            >
                                <item.icon className={styles.navIcon} />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className={styles.navBadge}>{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            {/* User Section */}
            <div className={styles.userSection}>
                <div className={styles.userAvatar}>김</div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>김사장님</div>
                    <div className={styles.userRole}>카페 관리자</div>
                </div>
                <button className={styles.settingsButton} title="로그아웃">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
}
