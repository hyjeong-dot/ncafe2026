import { useState, useEffect } from 'react';

export interface CategoryResponse {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
}

export interface CategoryListResponse {
    categories: CategoryResponse[];
    count: number;
}

export function useCategories() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                
                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }
                
                if (!response.ok) throw new Error('카테고리를 불러오는데 실패했습니다.');

                const data: CategoryListResponse = await response.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Fetch categories error:', error);
            }
        };

        fetchCategories();
    }, []);

    return { categories };
}
