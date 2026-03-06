import { useState, useEffect } from 'react';
import { MenuResponse } from '../../../_components/MenuGrid/useMenus';

export function useMenuDetail(id: number) {
    const [menu, setMenu] = useState<MenuResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/menus/${id}`);

                if (response.status === 401) {
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    throw new Error('메뉴 정보를 가져오는데 실패했습니다.');
                }
                const data = await response.json();
                setMenu(data);
            } catch (err) {
                console.error('Fetch menu detail error:', err);
                setError(err instanceof Error ? err.message : '알 수 없는 오류');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    return { menu, isLoading, error };
}
