'use client';

import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Menu } from '@/types/menu';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuGrid.module.css';

interface SortableMenuCardProps {
    menu: Menu;
    onToggleSoldOut: (menuId: string) => void;
    onDelete: (menuId: string) => void;
}

export default function SortableMenuCard({
    menu,
    onToggleSoldOut,
    onDelete,
}: SortableMenuCardProps) {
    const [isMounted, setIsMounted] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: menu.id });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    // Only apply dnd attributes after client-side mount to prevent hydration mismatch
    const dndAttributes = isMounted ? attributes : {};
    const dndListeners = isMounted ? listeners : {};

    return (
        <div ref={setNodeRef} style={style} className={styles.sortableCard}>
            <div className={styles.dragHandle} {...dndAttributes} {...dndListeners}>
                <GripVertical size={20} />
            </div>
            <MenuCard
                menu={menu}
                onToggleSoldOut={onToggleSoldOut}
                onDelete={onDelete}
            />
        </div>
    );
}

