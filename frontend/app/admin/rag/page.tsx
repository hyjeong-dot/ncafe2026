'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Save, X, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

interface RagDoc {
    id: number;
    content: string;
}

export default function RagManagementPage() {
    const [docs, setDocs] = useState<RagDoc[]>([]);
    const [inputText, setInputText] = useState('');
    const [editingDocId, setEditingDocId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchDocs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/agent/rag/documents');
            if (res.ok) {
                const data = await res.json();
                setDocs(data);
            } else {
                showNotification('error', '지식 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            showNotification('error', '서버 연결에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUpload = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/agent/rag/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: inputText })
            });
            if (res.ok) {
                showNotification('success', '새로운 지식이 임베딩되어 저장되었습니다! 🫠💜');
                setInputText('');
                fetchDocs();
            } else {
                showNotification('error', '업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            showNotification('error', '서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (editingDocId === null || !inputText.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/agent/rag/documents/${editingDocId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: inputText })
            });
            if (res.ok) {
                showNotification('success', '지식이 성공적으로 수정되었습니다.');
                setEditingDocId(null);
                setInputText('');
                fetchDocs();
            } else {
                showNotification('error', '수정 중 오류가 발생했습니다.');
            }
        } catch (error) {
            showNotification('error', '서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('이 지식을 삭제하시겠습니까? AI가 해당 내용을 잊어버리게 됩니다.')) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/agent/rag/documents/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showNotification('success', '지식이 삭제되었습니다.');
                fetchDocs();
            } else {
                showNotification('error', '삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            showNotification('error', '서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (doc: RagDoc) => {
        setEditingDocId(doc.id);
        setInputText(doc.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingDocId(null);
        setInputText('');
    };

    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>RAG 지식 관리 🪄</h1>
                    <p className={styles.subtitle}>AI '바리스타 메타몽'에게 줄 지식 데이터를 관리합니다.</p>
                </div>
                {notification && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {notification.message}
                    </div>
                )}
            </div>

            <div className={styles.mainGrid}>
                {/* 왼쪽: 입력 섹션 */}
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                                <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleUpload}>
                                    <Plus size={18} /> 지식 추가 및 임베딩
                                </button>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <p>💡 팁: 텍스트를 입력하고 저장하면 AI가 이해할 수 있는 벡터로 자동 변환되어 저장됩니다.</p>
                    </div>
                </div>

                {/* 오른쪽: 목록 섹션 */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        <Search size={20} />
                        저장된 지식 목록 ({docs.length})
                    </h2>
                    <div className={styles.docList}>
                        {docs.length === 0 ? (
                            <div className={styles.emptyState}>
                                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>아직 저장된 지식이 없습니다.<br/>왼쪽에서 지식을 추가해 보세요!</p>
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
                                        <button className={`${styles.iconButton} ${styles.deleteBtn}`} onClick={() => handleDelete(doc.id)} title="삭제">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .notification {
                    padding: 0.75rem 1.25rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    animation: slideIn 0.3s ease-out;
                }
                .success {
                    background: #dcfce7;
                    color: #166534;
                }
                .error {
                    background: #fee2e2;
                    color: #991b1b;
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
