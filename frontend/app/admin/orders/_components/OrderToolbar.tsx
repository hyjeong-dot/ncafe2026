'use client';

import { Search } from 'lucide-react';
import styles from '../page.module.css';

const STATUS_FILTERS = [
    { value: '', label: '모든 상태' },
    { value: 'PENDING', label: '결제 대기' },
    { value: 'PAID', label: '결제 완료' },
    { value: 'PREPARING', label: '준비 중' },
    { value: 'COMPLETED', label: '수령 완료' },
    { value: 'CANCELLED', label: '취소됨' },
];

interface OrderToolbarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
    resultCount: number;
}

export default function OrderToolbar({
    searchQuery, onSearchChange,
    statusFilter, onStatusChange,
    resultCount,
}: OrderToolbarProps) {
    const activeLabel = STATUS_FILTERS.find(f => f.value === statusFilter)?.label;

    return (
        <>
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="주문번호, 주문자명, 메뉴명으로 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    {STATUS_FILTERS.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
            </div>

            {(searchQuery || statusFilter) && (
                <div className={styles.resultCount}>
                    🔍 {resultCount}건
                    {statusFilter && ` · ${activeLabel}`}
                    {searchQuery && ` · "${searchQuery}"`}
                </div>
            )}
        </>
    );
}

export { STATUS_FILTERS };
