'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Coffee,
    Database,
    LucideIcon,
} from 'lucide-react';
import { useDashboardStats } from '../useDashboardStats';
import toast from 'react-hot-toast';
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

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();
    const { stats } = useDashboardStats();
    const [isOpen, setIsOpen] = useState(false);

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
                { href: '/admin/orders', label: '주문 관리', icon: ShoppingBag, badge: stats.todayOrders > 0 ? stats.todayOrders : undefined },
            ],
        },
        {
            group: '설정',
            items: [
                { href: '/admin/settings', label: '카페 설정', icon: Settings },
                { href: '/admin/rag', label: 'RAG 지식 관리', icon: Database },
            ],
        },
    ];

    // 권한 체크: admin이 아니면 홈으로 튕겨냄
    useEffect(() => {
        if (isLoading) return;

        const timer = setTimeout(() => {
            if (!user || user.role !== 'ROLE_ADMIN') {
                if (user) {
                    toast.error("접근 권한이 없어요! 💜");
                }
                router.replace('/');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [user, isLoading, router]);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

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

    if (isLoading || !user || user.role !== 'ROLE_ADMIN') {
        return null; 
    }

    return (
        <>
            {!isOpen && (
                <button
                    className={styles.hamburger}
                    onClick={() => setIsOpen(true)}
                    aria-label="메뉴 열기"
                >
                    <Menu size={24} />
                </button>
            )}

            {isOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>💜</div>
                    <div className={styles.logoText}>
                        메타몽 카페
                        <span className={styles.logoSubtext}>Admin</span>
                    </div>
                    <button 
                        className={styles.closeButton} 
                        onClick={() => setIsOpen(false)}
                        aria-label="메뉴 닫기"
                    >
                        <X size={24} />
                    </button>
                </div>

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

                <div className={styles.serviceSwitch}>
                    <Link href="/" className={styles.switchButton}>
                        <Home size={18} />
                        <span>홈 화면으로</span>
                    </Link>
                    <Link href="/menus" className={styles.switchButton}>
                        <Coffee size={18} />
                        <span>메뉴 주문하기</span>
                    </Link>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userAvatar}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.username}님</div>
                        <div className={styles.userRole}>관리자</div>
                    </div>
                    <button className={styles.settingsButton} title="로그아웃" onClick={async () => {
                        await logout();
                        router.push('/');
                    }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
