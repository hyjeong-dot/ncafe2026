import { useState, useEffect } from 'react';
import { Menu } from '@/types/menu';
import { Loader2, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuGrid.module.css';
import { useMenus } from './useMenus';

interface MenuGridProps {
    selectedCategory?: number | null;
    searchQuery?: string;
}

const ITEMS_PER_PAGE = 12;

export default function MenuGrid({ selectedCategory = null, searchQuery = '' }: MenuGridProps) {
    // const {
    //     filteredMenus,
    //     isLoading,
    //     toggleSoldOut,
    //     deleteMenu
    // } = useMenus({ selectedCategory, searchQuery });

    const menuListRequest = {
        categoryId: selectedCategory || undefined,
        searchQuery: searchQuery || undefined,
        page: 0,
        size: ITEMS_PER_PAGE
    };

    const { menus } = useMenus(menuListRequest);

    const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMenus = menus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (menuId: string) => {
        setMenuToDelete(menuId);
    };

    // const confirmDelete = () => {
    //     if (menuToDelete) {
    //         deleteMenu(menuToDelete);
    //         setMenuToDelete(null);
    //     }
    // };

    // if (isLoading) {
    //     return (
    //         <div className={styles.loadingState}>
    //             <Loader2 className={styles.loadingIcon} size={40} />
    //             <p>메뉴 정보를 불러오는 중...</p>
    //         </div>
    //     );
    // }

    return (
        <>
            <section className={styles.menuGrid} aria-label="Menu list">
                {currentMenus.map((menu) => (
                    // <MenuCard
                    //     key={menu.id}
                    //     menu={menu}
                    //     onDelete={handleDeleteClick}
                    // />
                    <div key={menu.id}>{menu.korName}</div>
                ))}
            </section>

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

            {/* <Modal
                isOpen={!!menuToDelete}
                onClose={() => setMenuToDelete(null)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={confirmDelete}
            /> */}
        </>
    );
}