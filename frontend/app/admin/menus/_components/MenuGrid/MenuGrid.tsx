'use client';

import { UtensilsCrossed } from 'lucide-react';
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
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Menu } from '@/types/menu';
import { useMenuStore } from '@/stores/menuStore';
import Modal from '@/components/common/Modal/Modal';
import SortableMenuCard from './SortableMenuCard';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuGrid.module.css';

interface MenuGridProps {
    menus: Menu[];
    isSearching: boolean;
    onToggleSoldOut: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function MenuGrid({ menus, isSearching, onToggleSoldOut, onDelete }: MenuGridProps) {
    const reorderMenus = useMenuStore((state) => state.reorderMenus);
    const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
    const [menuToDelete, setMenuToDelete] = useState<string | null>(null);

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
            <SortableContext items={menus.map((m) => m.id)} strategy={rectSortingStrategy}>
                <section className={styles.menuGrid} aria-label="Menu list">
                    {menus.map((menu) => (
                        <SortableMenuCard
                            key={menu.id}
                            menu={menu}
                            onToggleSoldOut={onToggleSoldOut}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </section>
            </SortableContext>

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

