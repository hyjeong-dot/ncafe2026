import { useState, useEffect } from 'react';

export interface CategoryResponseDto {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
}

export interface CategoryListResponseDto {
    categories: CategoryResponseDto[];
    count: number;
}


export function useCategories() {
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/admin/categories');
                
                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }
                
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data: CategoryListResponseDto = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return { categories };
}
