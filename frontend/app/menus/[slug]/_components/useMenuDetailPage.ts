import { useState, useCallback } from 'react';
import type { SelectedOptions } from '../MenuDetailOptions/MenuDetailOptions';

interface OptionMeta {
    id: number;
    isRequired: boolean;
}

export function useMenuDetailPage() {
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

    return {
        selectedOptions,
        extraPrice,
        selectedOptionNames,
        allRequiredSelected,
        handleOptionChange,
    };
}
