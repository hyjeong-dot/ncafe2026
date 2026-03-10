'use client';

import { useRag } from './_components/RagListSection/useRag';
import RagHeader from './_components/RagHeader';
import RagInputSection from './_components/RagInputSection';
import RagListSection from './_components/RagListSection';
import styles from './page.module.css';

/**
 * RAG 지식 관리 페이지 (Refactored to match Admin Menus structure)
 * 
 * - 비즈니스 로직: _hooks/useRag.ts
 * - UI 컴포넌트: _components 각 폴더 내부 (index.ts로 통제)
 */
export default function RagManagementPage() {
    const {
        docs,
        inputText,
        setInputText,
        editingDocId,
        isLoading,
        isDeleteModalOpen,
        handleUpload,
        handleFileChange,
        handleUpdate,
        handleDelete,
        confirmDelete,
        closeDeleteModal,
        startEditing,
        cancelEditing
    } = useRag();

    return (
        <main className={styles.container}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            <RagHeader />

            <div className={styles.mainGrid}>
                {/* 지식 입력 섹션 */}
                <RagInputSection 
                    inputText={inputText}
                    setInputText={setInputText}
                    editingDocId={editingDocId}
                    handleUpload={handleUpload}
                    handleUpdate={handleUpdate}
                    handleFileChange={handleFileChange}
                    cancelEditing={cancelEditing}
                />

                {/* 지식 목록 섹션 */}
                <RagListSection 
                    docs={docs}
                    startEditing={startEditing}
                    confirmDelete={confirmDelete}
                    isDeleteModalOpen={isDeleteModalOpen}
                    onDeleteConfirm={handleDelete}
                    onDeleteClose={closeDeleteModal}
                />
            </div>
        </main>
    );
}
