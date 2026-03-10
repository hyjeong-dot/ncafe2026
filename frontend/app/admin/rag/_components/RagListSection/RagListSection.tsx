import React from 'react';
import { Search, BookOpen, Edit3, Trash2 } from 'lucide-react';
import styles from './RagListSection.module.css';
import { RagDoc } from './useRag';

import Modal from '@/components/common/Modal/Modal';

interface RagListSectionProps {
    docs: RagDoc[];
    startEditing: (doc: RagDoc) => void;
    confirmDelete: (id: number) => void;
    isDeleteModalOpen: boolean;
    onDeleteConfirm: () => void;
    onDeleteClose: () => void;
}

export default function RagListSection({ 
    docs, 
    startEditing, 
    confirmDelete,
    isDeleteModalOpen,
    onDeleteConfirm,
    onDeleteClose
}: RagListSectionProps) {
    return (
        <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <Search size={20} />
                저장된 지식 목록 ({docs.length})
            </h2>
            <div className={styles.docList}>
                {docs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <BookOpen size={48} className={styles.emptyIcon} />
                        <p>아직 저장된 지식이 없습니다.<br />왼쪽에서 지식을 추가해 보세요!</p>
                    </div>
                ) : (
                    docs.map((doc) => (
                        <div key={doc.id} className={styles.docItem}>
                            <div className={styles.docContent}>
                                {doc.content}
                            </div>
                            <div className={styles.docActions}>
                                <button className={`${styles.iconButton} ${styles.editBtn}`} onClick={() => startEditing(doc)} title="수정">
                                    <Edit3 size={16} />
                                </button>
                                <button className={`${styles.iconButton} ${styles.deleteBtn}`} onClick={() => confirmDelete(doc.id)} title="삭제">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={onDeleteClose}
                onConfirm={onDeleteConfirm}
                title="지식 삭제 확인"
                description="이 지식을 정말 삭제하시겠습니까? AI가 해당 내용을 잊어버리게 됩니다. 🫠💜"
                confirmText="삭제하기"
                cancelText="취소"
                variant="danger"
            />
        </div>
    );
}
