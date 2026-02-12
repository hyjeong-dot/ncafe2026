'use client';

import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    return (
        <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={18} />
            <input
                type="text"
                className={styles.searchInput}
                placeholder="메뉴 이름, 설명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}
