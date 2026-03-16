import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

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

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.status === 401) {
                if (typeof window !== 'undefined') window.location.href = '/login';
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data: CategoryListResponseDto = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = async (name: string, icon: string) => {
        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, icon, sortOrder: categories.length }),
        });
        if (!res.ok) throw new Error('카테고리 생성 실패');
        toast.success('카테고리가 추가되었어요! 💜');
        await fetchCategories();
    };

    const updateCategory = async (id: number, name: string, icon: string) => {
        const res = await fetch(`/api/admin/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, icon }),
        });
        if (!res.ok) throw new Error('카테고리 수정 실패');
        toast.success('카테고리가 수정되었어요! ✏️');
        await fetchCategories();
    };

    const deleteCategory = async (id: number) => {
        const res = await fetch(`/api/admin/categories/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('카테고리 삭제 실패');
        toast.success('카테고리가 삭제되었어요! 🗑️');
        await fetchCategories();
    };

    return { categories, fetchCategories, createCategory, updateCategory, deleteCategory };
}
