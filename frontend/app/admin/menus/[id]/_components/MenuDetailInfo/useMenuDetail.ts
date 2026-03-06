import { useState, useEffect } from 'react';

export interface MenuImageDetail {
    id: number;
    srcUrl: string;
    sortOrder: number;
}

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    images?: MenuImageDetail[];
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    createdAt: string; // ISO string from backend
    updatedAt: string; // ISO string from backend
}

export function useMenuDetail(id: number) {
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || isNaN(id)) {
            setIsLoading(false);
            return;
        }

        const fetchMenu = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/admin/menus/${id}`);

                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch menu details');
                }

                const data: MenuDetail = await response.json();
                setMenu(data);
            } catch (err) {
                console.error('Error fetching menu detail:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu, isLoading, error };
}
