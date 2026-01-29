import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Menu, MenuCategory } from '@/types/menu';
import { useMenuStore } from '@/stores/menuStore';
import { Loader2, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import SortableMenuCard from './SortableMenuCard';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuGrid.module.css';

interface MenuGridProps {
    menus: Menu[];
    categories: MenuCategory[];
    isSearching: boolean;
    onToggleSoldOut: (id: string) => void;
    onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

export default function MenuGrid({ menus, categories, isSearching, onToggleSoldOut, onDelete }: MenuGridProps) {
    const setMenus = useMenuStore((state) => state.setMenus);
    const reorderMenus = useMenuStore((state) => state.reorderMenus);
    const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
    const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when filter changes (menus length changes)
    useEffect(() => {
        setCurrentPage(1);
    }, [menus.length, isSearching]);

    // Calculate pagination
    const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMenus = menus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMenus = async () => {
            // ... existing fetch logic ...
            try {
                const response = await fetch('http://localhost:8080/admin/menus');
                if (!response.ok) {
                    throw new Error('데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();

                // 백엔드 데이터를 프론트엔드 Menu 타입에 맞게 매핑
                const mappedData = data.map((item: any) => {
                    // 카테고리 매핑
                    const categoryId = String(item.categoryId || item.category || 'unknown');
                    const matchedCategory = categories.find(c => c.id === categoryId) || {
                        id: categoryId,
                        korName: '미분류',
                        engName: 'Uncategorized',
                        sortOrder: 99
                    };

                    return {
                        ...item,
                        id: String(item.id),
                        category: matchedCategory,
                        images: item.images || (item.image ? [{
                            id: 'img-' + item.id,
                            url: item.image,
                            isPrimary: true,
                            sortOrder: 1
                        }] : []),
                        isSoldOut: item.isSoldOut || false,
                        isAvailable: item.isAvailable ?? true,
                        options: item.options || [],
                        sortOrder: item.sortOrder || 0,
                        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
                    };
                });

                setMenus(mappedData);
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('메뉴 목록을 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [setMenus, categories]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이동 후 드래그 시작 (클릭과 구분)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const menu = menus.find((m) => m.id === active.id);
        setActiveMenu(menu || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveMenu(null);

        if (over && active.id !== over.id) {
            reorderMenus(String(active.id), String(over.id));
            toast.success('메뉴 순서가 변경되었습니다.');
        }
    };

    const handleDeleteClick = (menuId: string) => {
        setMenuToDelete(menuId);
    };

    const confirmDelete = () => {
        if (menuToDelete) {
            onDelete(menuToDelete);
            toast.success('메뉴가 삭제되었습니다.');
            setMenuToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.loadingIcon} size={40} />
                <p>메뉴 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <UtensilsCrossed size={32} />
                </div>
                <h3 className={styles.emptyTitle}>
                    {isSearching ? '검색 결과가 없습니다' : '등록된 메뉴가 없습니다'}
                </h3>
                <p className={styles.emptyDescription}>
                    {isSearching
                        ? '다른 검색어로 시도해보세요'
                        : '새 메뉴를 추가하여 시작하세요'}
                </p>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={currentMenus.map((m) => m.id)} strategy={rectSortingStrategy}>
                <section className={styles.menuGrid} aria-label="Menu list">
                    {currentMenus.map((menu) => (
                        <SortableMenuCard
                            key={menu.id}
                            menu={menu}
                            onToggleSoldOut={onToggleSoldOut}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </section>
            </SortableContext>

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

            <DragOverlay adjustScale={false}>
                {activeMenu ? (
                    <div className={styles.dragOverlay}>
                        <MenuCard
                            menu={activeMenu}
                            onToggleSoldOut={onToggleSoldOut}
                            onDelete={() => { }} // 드래그 중에는 삭제 기능 비활성화
                        />
                    </div>
                ) : null}
            </DragOverlay>

            <Modal
                isOpen={!!menuToDelete}
                onClose={() => setMenuToDelete(null)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={confirmDelete}
            />
        </DndContext>
    );
}


