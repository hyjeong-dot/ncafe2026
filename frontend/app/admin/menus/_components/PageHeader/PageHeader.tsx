import Link from 'next/link';
import { Plus } from 'lucide-react';
import styles from './PageHeader.module.css';
import { useEffect, useState } from 'react';

interface PageHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function PageHeader({ searchQuery, setSearchQuery }: PageHeaderProps) {

    const [totalCount, setTotalCount] = useState(0);
    const [soldOutCount, setSoldOutCount] = useState(0);

    // useEffect(() => {
    //     const fetchTotalCount = async () => {
    //         try {
    //             const response = await fetch('/api/admin/menus/count');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch total count');
    //             }
    //             const data: { totalCount: number } = await response.json();
    //             setTotalCount(data.totalCount);
    //         } catch (error) {
    //             console.error('Error fetching total count:', error);
    //         }
    //     };

    //     fetchTotalCount();
    // }, []);

    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>메뉴 관리</h1>
                <p className={styles.subtitle}>카페 메뉴를 추가하고 관리하세요</p>
            </div>
            <div className={styles.searchSection}>
                <input
                    type="text"
                    placeholder="메뉴 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Link href="/admin/menus/new" className={styles.addButton}>
                <Plus size={20} />
                새 메뉴 추가
            </Link>
        </header>
    );
}
