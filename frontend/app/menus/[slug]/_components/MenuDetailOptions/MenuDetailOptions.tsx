'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Square, CircleDot, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './MenuDetailOptions.module.css';

// ─── 타입 정의 ───
interface OptionItem {
    id: number;
    name: string;
    priceDelta: number;
    sortOrder: number;
}

interface MenuOption {
    id: number;
    menuId: number;
    name: string;
    isRequired: boolean;
    isMultiSelect: boolean;
    sortOrder: number;
    items: OptionItem[];
}

// 선택 상태: { optionId: [선택된 itemId들] }
export type SelectedOptions = Record<number, number[]>;

interface MenuDetailOptionsProps {
    slug: string;
    onSelectionChange?: (selections: SelectedOptions, totalExtra: number, selectedNames: string[], metas?: { id: number; isRequired: boolean }[]) => void;
}

export default function MenuDetailOptions({ slug, onSelectionChange }: MenuDetailOptionsProps) {
    const [options, setOptions] = useState<MenuOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selections, setSelections] = useState<SelectedOptions>({});
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

    // 옵션 데이터 조회
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/menus/${slug}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                const opts: MenuOption[] = data.options || [];
                setOptions(opts);

                // 모든 그룹 펼치기
                setExpandedGroups(new Set(opts.map(o => o.id)));

                // 필수 그룹 중 단일 선택이면 첫 번째 항목 자동 선택
                const initialSelections: SelectedOptions = {};
                opts.forEach(opt => {
                    if (opt.isRequired && !opt.isMultiSelect && opt.items.length > 0) {
                        initialSelections[opt.id] = [opt.items[0].id];
                    }
                });
                setSelections(initialSelections);
            } catch (err) {
                console.error('Error fetching menu options:', err);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchOptions();
    }, [slug]);

    // 선택 변경 시 부모에 알림
    const calcExtra = useCallback((sels: SelectedOptions) => {
        let total = 0;
        options.forEach(opt => {
            const selectedIds = sels[opt.id] || [];
            opt.items.forEach(item => {
                if (selectedIds.includes(item.id)) {
                    total += item.priceDelta;
                }
            });
        });
        return total;
    }, [options]);

    // 선택된 옵션 이름 목록 반환
    const getSelectedNames = useCallback((sels: SelectedOptions): string[] => {
        const names: string[] = [];
        options.forEach(opt => {
            const selectedIds = sels[opt.id] || [];
            opt.items.forEach(item => {
                if (selectedIds.includes(item.id)) {
                    names.push(item.name);
                }
            });
        });
        return names;
    }, [options]);

    useEffect(() => {
        if (onSelectionChange && options.length > 0) {
            const metas = options.map(o => ({ id: o.id, isRequired: o.isRequired }));
            onSelectionChange(selections, calcExtra(selections), getSelectedNames(selections), metas);
        }
    }, [selections, onSelectionChange, calcExtra, getSelectedNames, options.length]);

    // 단일 선택 (라디오)
    const handleRadioSelect = (optionId: number, itemId: number) => {
        setSelections(prev => ({
            ...prev,
            [optionId]: [itemId],
        }));
    };

    // 다중 선택 (체크박스)
    const handleCheckboxToggle = (optionId: number, itemId: number) => {
        setSelections(prev => {
            const current = prev[optionId] || [];
            const isSelected = current.includes(itemId);
            return {
                ...prev,
                [optionId]: isSelected
                    ? current.filter(id => id !== itemId)
                    : [...current, itemId],
            };
        });
    };

    // 그룹 접기/펼치기
    const toggleGroup = (optionId: number) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(optionId)) next.delete(optionId);
            else next.add(optionId);
            return next;
        });
    };

    if (isLoading || options.length === 0) return null;

    return (
        <div className={styles.optionsContainer}>
            <h3 className={styles.optionsTitle}>옵션 선택</h3>

            {options.map(option => {
                const isExpanded = expandedGroups.has(option.id);
                const selectedIds = selections[option.id] || [];
                const hasSelection = selectedIds.length > 0;

                return (
                    <div
                        key={option.id}
                        className={`${styles.optionGroup} ${option.isRequired && !hasSelection ? styles.optionGroupWarning : ''}`}
                    >
                        {/* 그룹 헤더 */}
                        <button
                            type="button"
                            className={styles.groupHeader}
                            onClick={() => toggleGroup(option.id)}
                        >
                            <div className={styles.groupInfo}>
                                <span className={styles.groupName}>{option.name}</span>
                                {option.isRequired && (
                                    <span className={styles.requiredBadge}>필수</span>
                                )}
                                {!option.isRequired && (
                                    <span className={styles.optionalBadge}>선택</span>
                                )}
                                <span className={styles.selectType}>
                                    {option.isMultiSelect ? '(중복 가능)' : '(1개 선택)'}
                                </span>
                            </div>
                            <div className={styles.groupRight}>
                                {hasSelection && (
                                    <span className={styles.selectedCount}>
                                        {selectedIds.length}개 선택
                                    </span>
                                )}
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                        </button>

                        {/* 항목 리스트 */}
                        {isExpanded && (
                            <div className={styles.itemsList}>
                                {option.items.map(item => {
                                    const isSelected = selectedIds.includes(item.id);

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ''}`}
                                            onClick={() =>
                                                option.isMultiSelect
                                                    ? handleCheckboxToggle(option.id, item.id)
                                                    : handleRadioSelect(option.id, item.id)
                                            }
                                        >
                                            <div className={styles.itemLeft}>
                                                {option.isMultiSelect ? (
                                                    isSelected ?
                                                        <CheckSquare size={18} className={styles.checkIcon} /> :
                                                        <Square size={18} className={styles.uncheckIcon} />
                                                ) : (
                                                    isSelected ?
                                                        <CircleDot size={18} className={styles.checkIcon} /> :
                                                        <Circle size={18} className={styles.uncheckIcon} />
                                                )}
                                                <span className={styles.itemName}>{item.name}</span>
                                            </div>
                                            {item.priceDelta !== 0 && (
                                                <span className={`${styles.itemPrice} ${item.priceDelta > 0 ? styles.priceUp : styles.priceDown}`}>
                                                    {item.priceDelta > 0 ? '+' : ''}{item.priceDelta.toLocaleString()}원
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
