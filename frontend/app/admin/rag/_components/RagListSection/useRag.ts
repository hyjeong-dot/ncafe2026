import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface RagDoc {
    id: number;
    content: string;
}

export function useRag() {
    const [docs, setDocs] = useState<RagDoc[]>([]);
    const [inputText, setInputText] = useState('');
    const [editingDocId, setEditingDocId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDocs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/agent/rag/documents');
            if (res.ok) {
                const data = await res.json();
                setDocs(data);
            } else {
                toast.error('지식 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            toast.error('서버 연결에 실패했습니다.');
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
                toast.success('새로운 지식이 임베딩되어 저장되었습니다! 🫠💜');
                setInputText('');
                fetchDocs();
            } else {
                toast.error('업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setInputText(content);
                toast.success(`${file.name} 파일을 불러왔습니다. 내용을 확인 후 업로드 해주세요!`);
            }
        };
        reader.onerror = () => toast.error('파일을 읽는 중 오류가 발생했습니다.');
        reader.readAsText(file);
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
                toast.success('지식이 성공적으로 수정되었습니다.');
                setEditingDocId(null);
                setInputText('');
                fetchDocs();
            } else {
                toast.error('수정 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<number | null>(null);

    const handleDelete = async () => {
        if (docToDelete === null) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/agent/rag/documents/${docToDelete}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('지식이 삭제되었습니다.');
                fetchDocs();
            } else {
                toast.error('삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setDocToDelete(null);
        }
    };

    const confirmDelete = (id: number) => {
        setDocToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDocToDelete(null);
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

    return {
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
    };
}
