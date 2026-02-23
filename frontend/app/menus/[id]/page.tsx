'use client';

import { use } from 'react';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailImage from './_components/MenuDetailImage';
import MenuDetailInfo from './_components/MenuDetailInfo';
import styles from './page.module.css';

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = use(params);
    const id = Number(idStr);

    return (
        <div className={styles.page}>
            <MenuDetailHeader />

            <main className={styles.container}>
                <div className={styles.layout}>
                    {/* Left: Images */}
                    <MenuDetailImage menuId={id} />

                    {/* Right: Info */}
                    <MenuDetailInfo id={id} />
                </div>
            </main>
        </div>
    );
}
