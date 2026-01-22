import { Search } from 'lucide-react';
import { MenuCategory } from '@/types/menu';
import CategoryTabs from '../CategoryTabs/CategoryTabs';
import styles from './MenuFilterBar.module.css';

interface MenuFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: MenuCategory[];
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
    menuCounts: Record<string, number>;
}

export default function MenuFilterBar({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onSelectCategory,
    menuCounts
}: MenuFilterBarProps) {
    return (
        <section className={styles.filters} aria-label="Filter menus">
            <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} aria-hidden="true" />
                <input
                    type="text"
                    placeholder="메뉴 이름, 설명으로 검색..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search menus"
                />
            </div>
            <div className={styles.categoryFilter}>
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                    menuCounts={menuCounts}
                />
            </div>
        </section>
    );
}
