'use client';

import { Search } from 'lucide-react';
import styles from '../page.module.css';

const STATUS_FILTERS = [
    { value: '', label: '모든 상태' },
    { value: 'WAITING', label: '대기중' },
    { value: 'ANSWERED', label: '답변완료' },
];

interface InquiryToolbarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    statusFilter: string;
    onStatusChange: (s: string) => void;
    resultCount: number;
}

export default function InquiryToolbar({
    searchQuery, onSearchChange,
    statusFilter, onStatusChange,
    resultCount,
}: InquiryToolbarProps) {
    return (
        <>
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="제목, 내용, 작성자로 검색..."
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
                <div className={styles.resultCount}>🔍 {resultCount}건</div>
            )}
        </>
    );
}
