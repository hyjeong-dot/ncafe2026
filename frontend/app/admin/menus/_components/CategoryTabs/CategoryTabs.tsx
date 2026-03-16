'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import styles from './CategoryTabs.module.css';
import { useCategories } from './useCategories';
import { useMenus } from '../MenuGrid/useMenus';

interface CategoryTabsProps {
    onCategoryChange: (id: number | null) => void;
    selectedCategory: number | null;
}

export default function CategoryTabs({ onCategoryChange, selectedCategory }: CategoryTabsProps) {
    const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
    const { menuCounts, stats } = useMenus();

    // 관리 모드
    const [isManaging, setIsManaging] = useState(false);

    // 추가/수정 모달
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [inputName, setInputName] = useState('');
    const [inputIcon, setInputIcon] = useState('☕');

    const EMOJI_OPTIONS = ['☕', '🥤', '🧁', '🍰', '🧇', '🍵', '🥛', '🫖', '🍹', '🍩', '🧋', '🥐', '🍪', '🎂'];

    const openCreateModal = () => {
        setEditingId(null);
        setInputName('');
        setInputIcon('☕');
        setModalOpen(true);
    };

    const openEditModal = (cat: { id: number; name: string; icon: string }) => {
        setEditingId(cat.id);
        setInputName(cat.name);
        setInputIcon(cat.icon);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!inputName.trim()) return;
        try {
            if (editingId) {
                await updateCategory(editingId, inputName.trim(), inputIcon);
            } else {
                await createCategory(inputName.trim(), inputIcon);
            }
            setModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`"${name}" 카테고리를 정말 삭제할까요? 해당 카테고리의 메뉴는 카테고리 없음 상태가 됩니다.`)) return;
        try {
            await deleteCategory(id);
            if (selectedCategory === id) onCategoryChange(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <section className={styles.tabs} aria-label="Filter menus">
                <button
                    className={`${styles.tab} ${selectedCategory === null ? styles.active : ''}`}
                    onClick={() => onCategoryChange(null)}
                >
                    <span className={styles.tabIcon}>📋</span>
                    전체
                    <span className={styles.tabCount}>{stats.total}</span>
                </button>

                {categories.map((category) => (
                    <div key={category.id} className={styles.tabWrapper}>
                        <button
                            className={`${styles.tab} ${selectedCategory === category.id ? styles.active : ''}`}
                            onClick={() => !isManaging && onCategoryChange(category.id)}
                        >
                            <span className={styles.tabIcon}>{category.icon}</span>
                            {category.name}
                            <span className={styles.tabCount}>{menuCounts[category.name] || 0}</span>
                        </button>
                        {isManaging && (
                            <div className={styles.tabActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => openEditModal(category)}
                                    title="수정"
                                >
                                    <Pencil size={12} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    onClick={() => handleDelete(category.id, category.name)}
                                    title="삭제"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* 관리 버튼 */}
                <button className={styles.manageBtn} onClick={() => setIsManaging(!isManaging)}>
                    {isManaging ? <X size={14} /> : <Pencil size={14} />}
                    <span>{isManaging ? '완료' : '관리'}</span>
                </button>

                {isManaging && (
                    <button className={styles.addBtn} onClick={openCreateModal}>
                        <Plus size={14} />
                        <span>추가</span>
                    </button>
                )}
            </section>

            {/* 모달 */}
            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{editingId ? '카테고리 수정' : '새 카테고리 추가'}</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <label className={styles.modalLabel}>카테고리 이름</label>
                            <input
                                className={styles.modalInput}
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                placeholder="예: 커피, 음료, 디저트"
                                autoFocus
                            />

                            <label className={styles.modalLabel}>아이콘</label>
                            <div className={styles.emojiGrid}>
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className={`${styles.emojiBtn} ${inputIcon === emoji ? styles.emojiSelected : ''}`}
                                        onClick={() => setInputIcon(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>취소</button>
                            <button className={styles.saveBtn} onClick={handleSave} disabled={!inputName.trim()}>
                                <Check size={14} />
                                {editingId ? '수정' : '추가'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
