'use client';

import styles from './CategoryFilter.module.css';
import { useCategories } from './useCategories';

interface CategoryFilterProps {
    selectedCategory: number | null;
    onCategoryChange: (id: number | null) => void;
    totalCount: number;
    menuCounts: Record<string, number>;
}

export default function CategoryFilter({
    selectedCategory,
    onCategoryChange,
    totalCount,
    menuCounts,
}: CategoryFilterProps) {
    const { categories } = useCategories();

    return (
        <nav className={styles.filterBar} aria-label="카테고리 필터">
            <div className={styles.inner}>
                <button
                    className={`${styles.chip} ${selectedCategory === null ? styles.active : ''}`}
                    onClick={() => onCategoryChange(null)}
                >
                    <span className={styles.chipIcon}>🍽️</span>
                    <span className={styles.chipLabel}>전체</span>
                    <span className={styles.chipCount}>{totalCount}</span>
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.chip} ${selectedCategory === cat.id ? styles.active : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        <span className={styles.chipIcon}>{cat.icon}</span>
                        <span className={styles.chipLabel}>{cat.name}</span>
                        <span className={styles.chipCount}>{menuCounts[cat.name] || 0}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
