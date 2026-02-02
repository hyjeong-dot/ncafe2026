'use client';

import { useState } from 'react';
import PageHeader from './_components/PageHeader';
import MenuStats from './_components/MenuStats';
import CategoryTabs from './_components/CategoryTabs';
import MenuGrid from './_components/MenuGrid';
import { useMenus } from './_components/MenuGrid/useMenus';
import styles from './page.module.css';

export default function MenusPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { stats } = useMenus({ selectedCategory, searchQuery });

    return (
        <main className={styles.container}>
            <PageHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <MenuStats stats={stats} />

            <CategoryTabs
                onCategoryChange={setSelectedCategory}
                selectedCategory={selectedCategory}
            />

            <MenuGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
            />
        </main>
    );
}