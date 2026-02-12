import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

export interface MenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    categoryIcon: string;
    imageSrc: string;
    images?: any[];
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface MenuListResponse {
    menus: MenuResponse[];
    menuCount: number;
}

interface UseMenusOptions {
    selectedCategory?: number | null;
    searchQuery?: string;
    page?: number;
    size?: number;
}

export function useMenus(options: UseMenusOptions = {}) {
    const { selectedCategory, searchQuery, page, size } = options;

    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch menus
    useEffect(() => {
        const fetchMenus = async () => {
            const url = new URL('/api/admin/menus', window.location.origin);
            const params = url.searchParams;

            if (selectedCategory) params.set('categoryId', selectedCategory.toString());
            if (searchQuery) params.set('searchQuery', searchQuery);
            if (page !== undefined) params.set('page', page.toString());
            if (size !== undefined) params.set('size', size.toString());

            try {
                const response = await fetch(url.toString());
                if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

                const data: MenuListResponse = await response.json();
                setMenus(data.menus || []);
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('메뉴 목록을 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [selectedCategory, searchQuery, page, size]);

    // Actions
    const toggleSoldOut = (menuId: string) => {
        setMenus(prev => prev.map(menu =>
            String(menu.id) === menuId ? { ...menu, isSoldOut: !menu.isSoldOut } : menu
        ));
        // TODO: Call backend API
    };

    const deleteMenu = (menuId: string) => {
        setMenus(prev => prev.filter(menu => String(menu.id) !== menuId));
        // TODO: Call backend API
    };

    // Stats
    const stats = useMemo(() => ({
        total: menus.length,
        available: menus.filter(m => !m.isSoldOut).length,
        soldOut: menus.filter(m => m.isSoldOut).length
    }), [menus]);

    // Menu counts by category - using categoryName since ID isn't in MenuResponse
    const menuCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        menus.forEach((menu) => {
            counts[menu.categoryName] = (counts[menu.categoryName] || 0) + 1;
        });
        return counts;
    }, [menus]);

    return {
        menus,
        isLoading,
        stats,
        menuCounts,
        toggleSoldOut,
        deleteMenu
    };
}

