import { UtensilsCrossed } from 'lucide-react';
import { Menu } from '@/types/menu';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuGrid.module.css';

interface MenuGridProps {
    menus: Menu[];
    isSearching: boolean;
    onToggleSoldOut: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function MenuGrid({ menus, isSearching, onToggleSoldOut, onDelete }: MenuGridProps) {
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
        <section className={styles.menuGrid} aria-label="Menu list">
            {menus.map((menu) => (
                <MenuCard
                    key={menu.id}
                    menu={menu}
                    onToggleSoldOut={onToggleSoldOut}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
}
