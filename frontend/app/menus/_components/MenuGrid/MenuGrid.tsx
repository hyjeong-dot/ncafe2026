'use client';

import styles from './MenuGrid.module.css';
import MenuCard from '../MenuCard/MenuCard';
import { useMenus } from './useMenus';

interface MenuGridProps {
    selectedCategory: number | null;
    searchQuery: string;
}

export default function MenuGrid({ selectedCategory, searchQuery }: MenuGridProps) {
    const { menus, isLoading, error } = useMenus({
        categoryId: selectedCategory,
        searchQuery: searchQuery
    });

    if (isLoading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>메타몽이 메뉴를 준비하고 있어요... 💜</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.emptyWrapper}>
                <span className={styles.emptyEmoji}>😢</span>
                <p className={styles.emptyText}>메뉴를 불러오는데 문제가 생겼어요</p>
                <p className={styles.emptySubText}>{error}</p>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.emptyWrapper}>
                <span className={styles.emptyEmoji}>🔍</span>
                <p className={styles.emptyText}>해당 카테고리에 메뉴가 없어요</p>
                <p className={styles.emptySubText}>다른 카테고리를 선택해보세요!</p>
            </div>
        );
    }

    return (
        <section className={styles.gridSection}>
            <div className={styles.grid}>
                {menus.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                ))}
            </div>
        </section>
    );
}
