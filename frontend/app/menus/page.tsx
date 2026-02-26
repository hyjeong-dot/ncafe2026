'use client';

import { useState } from 'react';
import MenuHeader from './_components/MenuHeader/MenuHeader';
import SearchBar from './_components/SearchBar/SearchBar';
import CategoryFilter from './_components/CategoryFilter/CategoryFilter';
import MenuGrid from './_components/MenuGrid/MenuGrid';
import { useMenus } from './_components/MenuGrid/useMenus';
import styles from './page.module.css';

export default function MenusPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.page}>
            <MenuHeader />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <MenuGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
            />
        </div>
    );
}
