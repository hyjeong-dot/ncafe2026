import { useState, useEffect } from 'react';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    isAvailable: boolean;
    createdAt: string; // ISO string from backend
    updatedAt: string; // ISO string from backend
    // Add other fields as backend supports them
}

export function useMenuDetail(id: number) {
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            try {
                setIsLoading(true);
                // Adjust URL if needed (e.g., environment variable)
                const response = await fetch(`http://localhost:8080/admin/menus/${id}`);

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
