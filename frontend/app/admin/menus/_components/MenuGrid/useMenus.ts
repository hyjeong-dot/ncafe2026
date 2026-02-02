import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Menu } from '@/types/menu';

export interface MenuResponseDto {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryId: number;
    image?: string;
    images?: any[];
    isSoldOut: boolean;
    isAvailable: boolean;
    options?: any[];
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

interface UseMenusOptions {
    selectedCategory?: number | null;
    searchQuery?: string;
}

export function useMenus(options: UseMenusOptions = {}) {
    const { selectedCategory = null, searchQuery = '' } = options;

    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch menus
    useEffect(() => {
        const fetchMenus = async () => {

            const url = new URL('http://localhost:8080/admin/menus');

            const params = url.searchParams;
            if (selectedCategory) {
                params.set('categoryId', selectedCategory.toString());
            }
            if (searchQuery) {
                params.set('searchQuery', searchQuery);
            }

            try {
                const response = await fetch(url.toString());
                if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
                const data = await response.json();

                const mappedMenus: Menu[] = data.menus.map((item: any) => ({
                    ...item,
                    id: String(item.id),
                    category: {
                        id: String(item.categoryId || 'unknown'),
                        korName: '카테고리',
                        engName: 'Category',
                        sortOrder: 0
                    },
                    images: item.images || (item.image ? [{
                        id: 'img-' + item.id,
                        url: item.image,
                        isPrimary: true,
                        sortOrder: 1
                    }] : []),
                    isSoldOut: item.isSoldOut || false,
                    isAvailable: item.isAvailable ?? true,
                    options: item.options || [],
                    sortOrder: item.sortOrder || 0,
                    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
                }));

                setMenus(mappedMenus);
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('메뉴 목록을 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [selectedCategory, searchQuery]);

    // Filtered menus based on options
    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => {
            if (selectedCategory !== null && menu.category.id !== String(selectedCategory)) {
                return false;
            }
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

    // Actions
    const toggleSoldOut = (menuId: string) => {
        setMenus(prev => prev.map(menu =>
            menu.id === menuId ? { ...menu, isSoldOut: !menu.isSoldOut } : menu
        ));
        // TODO: Call backend API
    };

    const deleteMenu = (menuId: string) => {
        setMenus(prev => prev.filter(menu => menu.id !== menuId));
        // TODO: Call backend API
    };

    // Stats
    const stats = useMemo(() => ({
        total: menus.length,
        available: menus.filter(m => !m.isSoldOut).length,
        soldOut: menus.filter(m => m.isSoldOut).length
    }), [menus]);

    // Menu counts by category
    const menuCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        menus.forEach((menu) => {
            counts[menu.category.id] = (counts[menu.category.id] || 0) + 1;
        });
        return counts;
    }, [menus]);

    return {
        menus,
        filteredMenus,
        isLoading,
        stats,
        menuCounts,
        toggleSoldOut,
        deleteMenu
    };
}
