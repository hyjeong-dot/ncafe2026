'use client';

import { CheckCircle2, Circle, Settings2 } from 'lucide-react';
import styles from './MenuDetailOptions.module.css';

interface OptionItem {
    id: number;
    name: string;
    price: number;
}

interface OptionCategory {
    id: number;
    name: string;
    isRequired: boolean;
    isMultiSelect: boolean;
    items: OptionItem[];
}

const DUMMY_OPTIONS: OptionCategory[] = [
    {
        id: 1,
        name: '사이즈 선택',
        isRequired: true,
        isMultiSelect: false,
        items: [
            { id: 101, name: 'Regular', price: 0 },
            { id: 102, name: 'Large', price: 500 },
        ]
    },
    {
        id: 2,
        name: '온도 (HOT/ICE)',
        isRequired: true,
        isMultiSelect: false,
        items: [
            { id: 201, name: 'HOT', price: 0 },
            { id: 202, name: 'ICE', price: 0 },
        ]
    },
    {
        id: 3,
        name: '샷 추가',
        isRequired: false,
        isMultiSelect: true,
        items: [
            { id: 301, name: '샷 추가', price: 500 },
        ]
    },
    {
        id: 4,
        name: '시럽 선택',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 401, name: '바닐라 시럽', price: 500 },
            { id: 402, name: '헤이즐넛 시럽', price: 500 },
            { id: 403, name: '카라멜 시럽', price: 500 },
        ]
    },
    {
        id: 5,
        name: '얼음 양',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 501, name: '얼음 조금', price: 0 },
            { id: 502, name: '얼음 보통', price: 0 },
            { id: 503, name: '얼음 많이', price: 0 },
        ]
    },
    {
        id: 6,
        name: '휘핑 크림',
        isRequired: false,
        isMultiSelect: false,
        items: [
            { id: 601, name: '휘핑 없이', price: 0 },
            { id: 602, name: '휘핑 조금', price: 0 },
            { id: 603, name: '휘핑 보통', price: 0 },
            { id: 604, name: '휘핑 많이', price: 500 },
        ]
    }
];

export default function MenuDetailOptions() {
    return (
        <section className={styles.optionsSection}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <Settings2 size={20} />
                    옵션 구성 정보
                </h2>
            </div>

            <div className={styles.optionsList}>
                {DUMMY_OPTIONS.map((category) => (
                    <div key={category.id} className={styles.optionGroup}>
                        <div className={styles.groupHeader}>
                            <h3 className={styles.groupName}>
                                {category.name}
                                {category.isRequired && <span className={styles.requiredMark}>*</span>}
                            </h3>
                            <span className={styles.typeBadge}>
                                {category.isMultiSelect ? '다중 선택' : '단일 선택'}
                            </span>
                        </div>

                        <ul className={styles.itemList}>
                            {category.items.map((item) => (
                                <li key={item.id} className={styles.item}>
                                    <div className={styles.itemContent}>
                                        {category.isMultiSelect ?
                                            <CheckCircle2 size={14} className={styles.icon} /> :
                                            <Circle size={14} className={styles.icon} />
                                        }
                                        <span className={styles.itemName}>{item.name}</span>
                                    </div>
                                    {item.price > 0 && (
                                        <span className={styles.itemPrice}>
                                            +{item.price.toLocaleString()}원
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}