import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MenuGrid.module.css';
import MenuCard from '../MenuCard/MenuCard';
import { useMenus } from './useMenus';

interface MenuGridProps {
    selectedCategory: number | null;
    searchQuery: string;
}

const ITEMS_PER_PAGE = 8;

export default function MenuGrid({ selectedCategory, searchQuery }: MenuGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const { menus, totalCount, isLoading, error } = useMenus({
        categoryId: selectedCategory,
        searchQuery: searchQuery,
        page: currentPage - 1,
        size: ITEMS_PER_PAGE
    });

    // 필터 변경 시 첫 페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>메타몽이 메뉴를 준비하고 있어요... 💜</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.emptyWrapper}>
                <span className={styles.emptyEmoji}>😢</span>
                <p className={styles.emptyText}>메뉴를 불러오는데 문제가 생겼어요</p>
                <p className={styles.emptySubText}>{error}</p>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.emptyWrapper}>
                <span className={styles.emptyEmoji}>🔍</span>
                <p className={styles.emptyText}>해당 카테고리에 메뉴가 없어요</p>
                <p className={styles.emptySubText}>다른 카테고리를 선택해보세요!</p>
            </div>
        );
    }

    return (
        <section className={styles.gridSection}>
            <div className={styles.grid}>
                {menus.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}
