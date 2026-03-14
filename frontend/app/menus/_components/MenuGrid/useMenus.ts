import { useState, useEffect, useMemo } from 'react';

export interface MenuResponse {
    id: number;
    slug: string;
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
    page?: number;
    size?: number;
}

export function useMenus(options: UseMenusOptions = {}) {
    const { categoryId, searchQuery, page, size } = options;

    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [totalMenuCount, setTotalMenuCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            setIsLoading(true);
            setError(null);

            const url = new URL('/api/menus', window.location.origin);
            if (categoryId) url.searchParams.set('categoryId', categoryId.toString());
            if (searchQuery) url.searchParams.set('searchQuery', searchQuery);
            if (page !== undefined) url.searchParams.set('page', page.toString());
            if (size !== undefined) url.searchParams.set('size', size.toString());

            try {
                const response = await fetch(url.toString());
                
                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }
                
                if (!response.ok) throw new Error('메뉴를 불러오는데 실패했습니다.');

                const data: MenuListResponse = await response.json();
                setMenus(data.menus || []);
                setTotalMenuCount(data.menuCount || 0);
            } catch (err) {
                console.error('Fetch menus error:', err);
                setError(err instanceof Error ? err.message : '알 수 없는 오류');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [categoryId, searchQuery, page, size]);

    // 위 counts 로직은 필터링된 메뉴 기준이므로, 카테고리 필터 등에 쓸 때는 '필터 없는' useMenus를 별도로 부르는 것이 좋음 (Admin 방식)
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
        error,
        totalCount: totalMenuCount,
        menuCounts
    };
}
