'use client';

import { use } from 'react';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailImage from './_components/MenuDetailImage';
import MenuDetailInfo from './_components/MenuDetailInfo';
import MenuDetailOptions from './_components/MenuDetailOptions/MenuDetailOptions';
import { useMenuDetailPage } from './_components/useMenuDetailPage';
import styles from './page.module.css';

export default function MenuDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const {
        selectedOptions,
        extraPrice,
        selectedOptionNames,
        allRequiredSelected,
        handleOptionChange,
    } = useMenuDetailPage();

    return (
        <div className={styles.page}>
            <MenuDetailHeader />

            <main className={styles.container}>
                <div className={styles.layout}>
                    <MenuDetailImage slug={slug} />

                    <div>
                        <MenuDetailInfo
                            slug={slug}
                            selectedOptions={selectedOptions}
                            extraPrice={extraPrice}
                            selectedOptionNames={selectedOptionNames}
                            allRequiredSelected={allRequiredSelected}
                        />
                        <MenuDetailOptions
                            slug={slug}
                            onSelectionChange={handleOptionChange}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
