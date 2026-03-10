import React from 'react';
import { BookOpen, Save, X, Plus } from 'lucide-react';
import styles from './RagInputSection.module.css';

interface RagInputSectionProps {
    inputText: string;
    setInputText: (text: string) => void;
    editingDocId: number | null;
    handleUpdate: () => void;
    cancelEditing: () => void;
    handleUpload: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RagInputSection({
    inputText,
    setInputText,
    editingDocId,
    handleUpdate,
    cancelEditing,
    handleUpload,
    handleFileChange
}: RagInputSectionProps) {
    return (
        <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <BookOpen size={20} />
                {editingDocId ? '지식 수정하기' : '새로운 지식 주입'}
            </h2>
            <div className={styles.inputGroup}>
                <textarea
                    className={styles.textarea}
                    placeholder="AI가 학습할 텍스트 내용을 입력하세요 (예: 계절 메뉴 이벤트 정보, 상세 서비스 가이드 등)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className={styles.buttonGroup}>
                    {editingDocId ? (
                        <>
                            <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleUpdate}>
                                <Save size={18} /> 수정 완료
                            </button>
                            <button className={styles.button} onClick={cancelEditing} style={{ background: '#e2e8f0' }}>
                                <X size={18} /> 취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleUpload}>
                                <Plus size={18} /> 지식 추가 및 임베딩
                            </button>
                            <label className={`${styles.button} ${styles.fileButton}`}>
                                <Plus size={18} /> 파일 업로드 (.txt, .md)
                                <input 
                                    type="file" 
                                    accept=".txt,.md" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none' }} 
                                />
                            </label>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.tip}>
                <p>💡 팁: 텍스트를 입력하고 저장하면 AI가 이해할 수 있는 벡터로 자동 변환되어 저장됩니다.</p>
            </div>
        </div>
    );
}
