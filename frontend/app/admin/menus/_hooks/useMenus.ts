import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useMenuStore } from '@/stores/menuStore';

interface UseMenuReturn {
    // State
    filteredMenus: ReturnType<typeof useMenuStore.getState>['menus'];
    menuCounts: Record<string, number>;
    stats: {
        total: number;
        available: number;
        soldOut: number;
    };

    // Filters state
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;

    // Actions
    toggleSoldOut: (menuId: string) => void;
    deleteMenu: (menuId: string) => void;
}

export function useMenus(): UseMenuReturn {
    // Get menus from Zustand store
    const menus = useMenuStore((state) => state.menus);
    const storeToggleSoldOut = useMenuStore((state) => state.toggleSoldOut);
    const storeDeleteMenu = useMenuStore((state) => state.deleteMenu);

    // Local filter state
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 카테고리별 메뉴 개수 계산
    const menuCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        menus.forEach((menu) => {
            counts[menu.category.id] = (counts[menu.category.id] || 0) + 1;
        });
        return counts;
    }, [menus]);

    // 필터링된 메뉴
    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => {
            // 카테고리 필터
            if (selectedCategory && menu.category.id !== selectedCategory) {
                return false;
            }
            // 검색 필터
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    menu.korName.toLowerCase().includes(query) ||
                    menu.engName.toLowerCase().includes(query) ||
                    menu.description.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [menus, selectedCategory, searchQuery]);

    // 통계
    const stats = useMemo(() => {
        const total = menus.length;
        const available = menus.filter((m) => !m.isSoldOut).length;
        const soldOut = menus.filter((m) => m.isSoldOut).length;
        return { total, available, soldOut };
    }, [menus]);

    // 품절 토글 (using store action)
    const toggleSoldOut = (menuId: string) => {
        storeToggleSoldOut(menuId);
    };

    // 삭제 (using store action)
    const deleteMenu = (menuId: string) => {
        storeDeleteMenu(menuId);
    };

    return {
        filteredMenus,
        menuCounts,
        stats,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toggleSoldOut,
        deleteMenu,
    };
}
