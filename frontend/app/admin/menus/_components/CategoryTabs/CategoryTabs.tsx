'use client';

import { MenuCategory } from '@/types/menu';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
    categories: MenuCategory[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
    menuCounts: Record<string, number>;
}

export default function CategoryTabs({
    categories,
    selectedCategory,
    onSelectCategory,
    menuCounts,
}: CategoryTabsProps) {
    const totalCount = Object.values(menuCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedCategory === null ? styles.active : ''}`}
                onClick={() => onSelectCategory(null)}
            >
                <span className={styles.tabIcon}>📋</span>
                <span>전체</span>
                <span className={styles.tabCount}>{totalCount}</span>
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => onSelectCategory(category.id)}
                >
                    {category.icon && <span className={styles.tabIcon}>{category.icon}</span>}
                    <span>{category.korName}</span>
                    <span className={styles.tabCount}>{menuCounts[category.id] || 0}</span>
                </button>
            ))}
        </div>
    );
}
