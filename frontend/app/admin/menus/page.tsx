'use client';

import { mockMenus, mockCategories } from '@/mocks/menuData';
import PageHeader from './_components/PageHeader';
import MenuStats from './_components/MenuStats';
import MenuFilterBar from './_components/MenuFilterBar';
import MenuGrid from './_components/MenuGrid';
import { useMenus } from './_hooks/useMenus';
import styles from './page.module.css';

export default function MenusPage() {
    const {
        filteredMenus,
        menuCounts,
        stats,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toggleSoldOut,
        deleteMenu
    } = useMenus(mockMenus);

    return (
        <main className={styles.container}>
            <PageHeader
                title="메뉴 관리"
                subtitle="카페 메뉴를 추가하고 관리하세요"
                actionHref="/admin/menus/new"
                actionLabel="새 메뉴 추가"
            />

            <MenuStats stats={stats} />

            <MenuFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={mockCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                menuCounts={menuCounts}
            />

            <MenuGrid
                menus={filteredMenus}
                isSearching={!!searchQuery}
                onToggleSoldOut={toggleSoldOut}
                onDelete={deleteMenu}
            />
        </main>
    );
}
