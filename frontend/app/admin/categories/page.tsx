'use client';

import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, GripVertical } from 'lucide-react';
import { useCategories } from '../menus/_components/CategoryTabs/useCategories';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
    const { categories, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();

    // 모달 상태
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [inputName, setInputName] = useState('');
    const [inputIcon, setInputIcon] = useState('☕');

    // 드래그 상태
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [overIdx, setOverIdx] = useState<number | null>(null);
    const dragRef = useRef<number | null>(null);

    const EMOJI_OPTIONS = ['☕', '🥤', '🧁', '🍰', '🧇', '🍵', '🥛', '🫖', '🍹', '🍩', '🧋', '🥐', '🍪', '🎂', '🍦', '🥧', '🫗', '🍫'];

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
        if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?\n해당 카테고리에 속한 메뉴는 '카테고리 없음' 상태가 됩니다.`)) return;
        try {
            await deleteCategory(id);
        } catch (e) {
            console.error(e);
        }
    };

    // --- D&D 핸들러 ---
    const handleDragStart = (idx: number) => {
        setDragIdx(idx);
        dragRef.current = idx;
    };

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setOverIdx(idx);
    };

    const handleDrop = async (idx: number) => {
        const from = dragRef.current;
        if (from === null || from === idx) {
            setDragIdx(null);
            setOverIdx(null);
            return;
        }

        const reordered = [...categories];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(idx, 0, moved);

        setDragIdx(null);
        setOverIdx(null);

        try {
            await reorderCategories(reordered.map((c, i) => ({ id: c.id, sortOrder: i })));
        } catch (e) {
            console.error(e);
        }
    };

    const handleDragEnd = () => {
        setDragIdx(null);
        setOverIdx(null);
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>카테고리 관리</h1>
                    <p className={styles.subtitle}>드래그하여 순서를 변경하고, 카테고리를 추가/수정/삭제할 수 있어요.</p>
                </div>
                <button className={styles.addButton} onClick={openCreateModal}>
                    <Plus size={16} />
                    새 카테고리
                </button>
            </div>

            <div className={styles.list}>
                {categories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📂</span>
                        <p>등록된 카테고리가 없습니다.</p>
                        <button className={styles.addButton} onClick={openCreateModal}>
                            <Plus size={16} /> 첫 카테고리 추가
                        </button>
                    </div>
                ) : (
                    categories.map((cat, idx) => (
                        <div
                            key={cat.id}
                            className={`${styles.categoryItem} ${dragIdx === idx ? styles.dragging : ''} ${overIdx === idx ? styles.dropTarget : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={() => handleDrop(idx)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className={styles.dragHandle}>
                                <GripVertical size={16} />
                            </div>
                            <span className={styles.catIcon}>{cat.icon}</span>
                            <span className={styles.catName}>{cat.name}</span>
                            <span className={styles.catOrder}>#{idx + 1}</span>
                            <div className={styles.catActions}>
                                <button className={styles.editBtn} onClick={() => openEditModal(cat)} title="수정">
                                    <Pencil size={14} />
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.name)} title="삭제">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

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
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
        </main>
    );
}
