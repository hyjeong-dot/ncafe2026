'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './ChatMenuAction.module.css';

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

interface MenuData {
    id: number;
    korName: string;
    engName: string;
    price: number;
    imageSrc: string;
    isSoldOut: boolean;
    options: MenuOption[];
}

type SelectedOptions = Record<number, number[]>;

interface ChatMenuActionProps {
    menuId: number;
    intent: 'ORDER' | 'CART';
    actionCompleted?: boolean;         // 부모가 관리하는 완료 상태
    onComplete?: (message: string) => void;
    onMarkCompleted?: () => void;      // 완료 시 부모에게 알림 (메시지 상태에 저장)
}

export default function ChatMenuAction({ menuId, intent, actionCompleted, onComplete, onMarkCompleted }: ChatMenuActionProps) {
    const router = useRouter();
    const { addItem } = useCart();

    const [menu, setMenu] = useState<MenuData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selections, setSelections] = useState<SelectedOptions>({});
    const [isCompleted, setIsCompleted] = useState(actionCompleted || false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedMessage, setCompletedMessage] = useState('');
    const [completedOptions, setCompletedOptions] = useState('');

    // 사용자가 옵션을 직접 클릭했는지 추적
    const userInteracted = useRef(false);
    const autoExecuteTimer = useRef<NodeJS.Timeout | null>(null);
    const hasAutoExecuted = useRef(actionCompleted || false);

    // 이미 완료된 상태면 즉시 반환
    if (actionCompleted && !isCompleted) {
        setIsCompleted(true);
        hasAutoExecuted.current = true;
    }

    // 메뉴 + 옵션 데이터 로드
    useEffect(() => {
        // 이미 완료된 액션이면 데이터 로드 skip
        if (actionCompleted) {
            setIsLoading(false);
            return;
        }

        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/menus/${menuId}`);
                if (!res.ok) throw new Error('메뉴 정보 로드 실패');
                const data = await res.json();
                setMenu(data);

                // ✅ 옵션 자동 선택 하지 않음! 사용자가 직접 클릭하도록.
                setSelections({});
            } catch (err) {
                console.error('ChatMenuAction: menu fetch error', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, [menuId, actionCompleted]);

    // 필수 옵션이 모두 선택되었는지 체크
    const allRequiredSelected = useCallback((): boolean => {
        if (!menu) return false;
        const requiredOptions = menu.options.filter(o => o.isRequired);
        if (requiredOptions.length === 0) return true;
        return requiredOptions.every(opt => {
            const sel = selections[opt.id];
            return sel && sel.length > 0;
        });
    }, [menu, selections]);

    // 추가 금액 계산
    const calcExtra = useCallback((): number => {
        if (!menu) return 0;
        let total = 0;
        menu.options.forEach(opt => {
            const selectedIds = selections[opt.id] || [];
            opt.items.forEach(item => {
                if (selectedIds.includes(item.id)) {
                    total += item.priceDelta;
                }
            });
        });
        return total;
    }, [menu, selections]);

    // 선택된 옵션 이름 배열
    const getSelectedNames = useCallback((): string[] => {
        if (!menu) return [];
        const names: string[] = [];
        menu.options.forEach(opt => {
            const selectedIds = selections[opt.id] || [];
            opt.items.forEach(item => {
                if (selectedIds.includes(item.id)) {
                    names.push(item.name);
                }
            });
        });
        return names;
    }, [menu, selections]);

    // 자동 실행: 사용자가 옵션을 클릭한 적이 있고 + 필수 옵션 모두 채워졌을 때만
    useEffect(() => {
        if (isCompleted || isProcessing || !menu || hasAutoExecuted.current) return;

        // 옵션이 없는 메뉴 → 즉시 실행
        if (menu.options.length === 0) {
            executeAction();
            return;
        }

        // ✅ 사용자가 직접 옵션을 클릭한 적이 있을 때만 자동 실행 대기
        if (userInteracted.current && allRequiredSelected()) {
            if (autoExecuteTimer.current) {
                clearTimeout(autoExecuteTimer.current);
            }
            autoExecuteTimer.current = setTimeout(() => {
                executeAction();
            }, 1500);
        } else {
            if (autoExecuteTimer.current) {
                clearTimeout(autoExecuteTimer.current);
                autoExecuteTimer.current = null;
            }
        }

        return () => {
            if (autoExecuteTimer.current) {
                clearTimeout(autoExecuteTimer.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selections, menu, isCompleted, isProcessing, allRequiredSelected]);

    // 실제 실행 로직
    const executeAction = async () => {
        if (!menu || isProcessing || hasAutoExecuted.current) return;
        hasAutoExecuted.current = true;
        setIsProcessing(true);

        const extra = calcExtra();
        const selectedNames = getSelectedNames();

        try {
            const optionStr = selectedNames.length > 0 ? `(${selectedNames.join(', ')})` : '';

            if (intent === 'ORDER') {
                // ✅ 단일 주문: 장바구니를 거치지 않고 directOrder로 처리
                sessionStorage.setItem('directOrder', JSON.stringify([{
                    id: menu.id.toString(),
                    korName: menu.korName,
                    engName: menu.engName,
                    price: menu.price + extra,
                    quantity: 1,
                    imageSrc: menu.imageSrc,
                    selectedOptionNames: selectedNames.length > 0 ? selectedNames : undefined,
                }]));

                setCompletedMessage(`주문 준비 완료!`);
                setCompletedOptions(`${menu.korName}${optionStr} → 주문 페이지로 이동 중...`);
                setIsCompleted(true);
                onMarkCompleted?.();

                onComplete?.(`✅ ${menu.korName}${optionStr} 주문 페이지로 이동할게몽! 💜`);

                setTimeout(() => {
                    router.push('/order');
                }, 800);
            } else {
                // CART: 장바구니에 담기
                await addItem({
                    id: menu.id.toString(),
                    korName: menu.korName,
                    engName: menu.engName,
                    price: menu.price + extra,
                    imageSrc: menu.imageSrc,
                    selectedOptionNames: selectedNames.length > 0 ? selectedNames : undefined,
                });

                setCompletedMessage(`장바구니에 담았어요!`);
                setCompletedOptions(`${menu.korName}${optionStr}`);
                setIsCompleted(true);
                onMarkCompleted?.();

                onComplete?.(`✅ ${menu.korName}${optionStr} 장바구니에 담았어몽! 💜`);
            }
        } catch (err) {
            console.error('ChatMenuAction: execute error', err);
            hasAutoExecuted.current = false;
        } finally {
            setIsProcessing(false);
        }
    };

    // 단일 선택 (라디오) — 사용자 상호작용 플래그 설정
    const handleRadioSelect = (optionId: number, itemId: number) => {
        if (isCompleted || isProcessing) return;
        userInteracted.current = true;
        setSelections(prev => ({ ...prev, [optionId]: [itemId] }));
    };

    // 다중 선택 (체크박스) — 사용자 상호작용 플래그 설정
    const handleCheckboxToggle = (optionId: number, itemId: number) => {
        if (isCompleted || isProcessing) return;
        userInteracted.current = true;
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

    // ─── 렌더링 ───

    if (isLoading) {
        return (
            <div className={styles.actionCard}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner} />
                    <span>메뉴 정보 불러오는 중... 꼬물꼬물</span>
                </div>
            </div>
        );
    }

    // 이미 완료된 상태 (부모에서 전달받은 경우 포함)
    if (isCompleted) {
        return (
            <div className={`${styles.actionCard} ${styles.completedCard}`}>
                <div className={styles.completedMessage}>
                    <span className={styles.completedEmoji}>✅</span>
                    <span>{completedMessage || (intent === 'ORDER' ? '주문 완료!' : '장바구니 담기 완료!')}</span>
                </div>
                {completedOptions && (
                    <div className={styles.selectedSummary}>{completedOptions}</div>
                )}
            </div>
        );
    }

    if (!menu) return null;

    const extra = calcExtra();

    return (
        <div className={styles.actionCard}>
            {/* 메뉴 헤더 */}
            <div className={styles.menuHeader}>
                <span className={styles.menuEmoji}>☕</span>
                <div className={styles.menuInfo}>
                    <p className={styles.menuName}>{menu.korName}</p>
                    <p className={styles.menuPrice}>₩{menu.price.toLocaleString()}</p>
                </div>
            </div>

            {/* 옵션 그룹들 */}
            {menu.options.map(option => {
                const selectedIds = selections[option.id] || [];

                return (
                    <div key={option.id} className={styles.optionGroup}>
                        <div className={styles.optionLabel}>
                            {option.isRequired && <span className={styles.requiredDot} />}
                            <span>{option.name}</span>
                            {!option.isRequired && (
                                <span className={styles.optionalTag}>선택</span>
                            )}
                        </div>
                        <div className={styles.optionButtons}>
                            {option.items.map(item => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`${styles.optionBtn} ${isSelected ? styles.optionBtnSelected : ''} ${isProcessing ? styles.optionBtnDisabled : ''}`}
                                        onClick={() =>
                                            option.isMultiSelect
                                                ? handleCheckboxToggle(option.id, item.id)
                                                : handleRadioSelect(option.id, item.id)
                                        }
                                        disabled={isProcessing}
                                    >
                                        {item.name}
                                        {item.priceDelta !== 0 && (
                                            <span className={styles.priceDelta}>
                                                {item.priceDelta > 0 ? '+' : ''}{item.priceDelta.toLocaleString()}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* 합계 (옵션 추가금이 있으면 표시) */}
            {extra > 0 && (
                <div className={styles.totalPrice}>
                    <span>합계</span>
                    <span className={styles.totalPriceValue}>
                        ₩{(menu.price + extra).toLocaleString()}
                    </span>
                </div>
            )}

            {/* 처리 중 */}
            {isProcessing && (
                <div className={styles.processingOverlay}>
                    <div className={styles.loadingSpinner} />
                    <span>{intent === 'ORDER' ? '주문 준비 중...' : '장바구니에 담는 중...'}</span>
                </div>
            )}
        </div>
    );
}
