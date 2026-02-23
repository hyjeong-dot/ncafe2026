'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './MenuDetailHeader.module.css';

export default function MenuDetailHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/menus" className={styles.backLink}>
                    <ArrowLeft size={18} />
                    <span>전체 메뉴</span>
                </Link>
            </div>
        </header>
    );
}
