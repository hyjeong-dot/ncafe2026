import { useState, useMemo, useEffect } from 'react';
import { MenuCategory } from '@/types/menu';
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
    categories: MenuCategory[];
    isCategoriesLoading: boolean;

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

    // Categories state
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    // 카테고리 데이터 fetch
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/categories');
                if (!response.ok) {
                    throw new Error('카테고리 데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();

                // 백엔드 데이터를 프론트엔드 타입에 맞게 매핑
                const mappedCategories: MenuCategory[] = data.map((cat: any) => ({
                    id: String(cat.id),
                    korName: cat.name || cat.korName || '카테고리',
                    engName: cat.engName || cat.name || 'Category',
                    icon: cat.icon || '📦',
                    sortOrder: cat.sortOrder || 0
                })).sort((a: MenuCategory, b: MenuCategory) => a.sortOrder - b.sortOrder);

                setCategories(mappedCategories);
            } catch (error) {
                console.error('Categories fetch error:', error);
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
        categories,
        isCategoriesLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toggleSoldOut,
        deleteMenu,
    };
}
