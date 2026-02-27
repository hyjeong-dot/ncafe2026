import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MenuGrid.module.css';
import MenuCard from '../MenuCard/MenuCard';
import { useMenus } from './useMenus';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';

interface MenuGridProps {
    selectedCategory: number | null;
    searchQuery: string;
}

const ITEMS_PER_PAGE = 8;

export default function MenuGrid({ selectedCategory, searchQuery }: MenuGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);
    const [isImagesReady, setIsImagesReady] = useState(false);

    const { menus, isLoading, error } = useMenus({
        categoryId: selectedCategory,
        searchQuery: searchQuery
    });

    const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMenus = menus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 필터 변경 시 첫 페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // 페이지나 필터 변경 시 이미지 로딩 상태 리셋
    useEffect(() => {
        setIsImagesReady(false);
        setLoadedImagesCount(0);
    }, [selectedCategory, searchQuery, currentPage]);

    useEffect(() => {
        if (!isLoading && currentMenus && currentMenus.length > 0) {
            if (loadedImagesCount >= currentMenus.length) {
                setIsImagesReady(true);
            }
        } else if (!isLoading && currentMenus && currentMenus.length === 0) {
            setIsImagesReady(true);
        }
    }, [loadedImagesCount, currentMenus, isLoading]);

    const handleImageLoad = useCallback(() => {
        setLoadedImagesCount(prev => prev + 1);
    }, []);

    // 데이터 로딩 중 (이미지 제외 데이터만)
    if (isLoading && !isImagesReady) {
        return <LoadingDitto message="메타몽이 메뉴를 준비하고 있어요... 💜" />;
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
            {/* 이미지가 준비되지 않았을 때만 보여주는 오버레이 로더 */}
            {!isImagesReady && currentMenus.length > 0 && (
                <div className={styles.overlayLoader}>
                    <LoadingDitto message="이미지를 선명하게 다듬고 있어요... 💜" />
                </div>
            )}

            <div
                key={currentPage}
                className={`${styles.grid} ${isImagesReady ? styles.fadeIn : styles.hidden}`}
            >
                {currentMenus.map((menu) => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        onLoad={handleImageLoad}
                    />
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
