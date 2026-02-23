import { useState, useEffect, useMemo } from 'react';

export interface MenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    categoryIcon: string;
    imageSrc: string;
    isSoldOut: boolean;
}

export interface MenuListResponse {
    menus: MenuResponse[];
    menuCount: number;
}

interface UseMenusOptions {
    categoryId?: number | null;
    searchQuery?: string;
}

export function useMenus(options: UseMenusOptions = {}) {
    const { categoryId, searchQuery } = options;

    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            setIsLoading(true);
            setError(null);

            const url = new URL('/api/menus', window.location.origin);
            if (categoryId) url.searchParams.set('categoryId', categoryId.toString());
            if (searchQuery) url.searchParams.set('searchQuery', searchQuery);

            try {
                const response = await fetch(url.toString());
                if (!response.ok) throw new Error('메뉴를 불러오는데 실패했습니다.');

                const data: MenuListResponse = await response.json();
                setMenus(data.menus || []);
            } catch (err) {
                console.error('Fetch menus error:', err);
                setError(err instanceof Error ? err.message : '알 수 없는 오류');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [categoryId, searchQuery]);

    const menuCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        menus.forEach((menu) => {
            counts[menu.categoryName] = (counts[menu.categoryName] || 0) + 1;
        });
        return counts;
    }, [menus]);

    return { menus, isLoading, error, totalCount: menus.length, menuCounts };
}
