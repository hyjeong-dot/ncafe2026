'use client';

import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // `/` 키로 검색창 포커스
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // input, textarea 등에서 타이핑 중이면 무시
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            if (e.key === '/') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={styles.searchBarWrapper}>
            <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="찾으시는 메뉴가 있으신가요?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className={styles.kbd}>/</kbd>
            </div>
        </div>
    );
}
