import { useState, useEffect } from 'react';

export interface MenuImageResponse {
    id: number;
    menuId: number;
    srcUrl: string;
    altText: string;
    sortOrder: number;
}

export interface MenuImageListResponse {
    images: MenuImageResponse[];
}

export function useMenuImages(menuId: number) {
    const [images, setImages] = useState<MenuImageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!menuId) return;

        const fetchImages = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/admin/menus/${menuId}/menu-images`);

                if (!response.ok) {
                    throw new Error('Failed to fetch menu images');
                }

                const data: MenuImageListResponse = await response.json();
                setImages(data.images);
            } catch (err) {
                console.error('Error fetching menu images:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [menuId]);

    return { images, isLoading, error };
}
