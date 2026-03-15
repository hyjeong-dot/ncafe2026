'use client';

import { use, useState, useCallback } from 'react';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailImage from './_components/MenuDetailImage';
import MenuDetailInfo from './_components/MenuDetailInfo';
import MenuDetailOptions, { SelectedOptions } from './_components/MenuDetailOptions/MenuDetailOptions';
import styles from './page.module.css';

interface OptionMeta {
    id: number;
    isRequired: boolean;
}

export default function MenuDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [extraPrice, setExtraPrice] = useState(0);
    const [selectedOptionNames, setSelectedOptionNames] = useState<string[]>([]);
    const [optionMetas, setOptionMetas] = useState<OptionMeta[]>([]);

    const handleOptionChange = useCallback((
        selections: SelectedOptions,
        totalExtra: number,
        names: string[],
        metas?: OptionMeta[]
    ) => {
        setSelectedOptions(selections);
        setExtraPrice(totalExtra);
        setSelectedOptionNames(names);
        if (metas) setOptionMetas(metas);
    }, []);

    // 필수 옵션이 모두 선택되었는지
    const allRequiredSelected = optionMetas.length === 0 || optionMetas
        .filter(m => m.isRequired)
        .every(m => {
            const sel = selectedOptions[m.id];
            return sel && sel.length > 0;
        });

    return (
        <div className={styles.page}>
            <MenuDetailHeader />

            <main className={styles.container}>
                <div className={styles.layout}>
                    {/* Left: Images */}
                    <MenuDetailImage slug={slug} />

                    {/* Right: Info + Options */}
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
