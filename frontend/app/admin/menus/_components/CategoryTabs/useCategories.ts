import { useState, useEffect } from 'react';

export interface CategoryResponseDto {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
}

export interface CategoryListResponseDto {
    categories: CategoryResponseDto[];
    categoryCount: number;
}

export function useCategories() {
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/categories');
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

    // 카테고리별 메뉴 개수는 CategoryTabs에서 필요시 별도 계산
    const categoryCount = categories.length;


    return { categories, categoryCount };
}
