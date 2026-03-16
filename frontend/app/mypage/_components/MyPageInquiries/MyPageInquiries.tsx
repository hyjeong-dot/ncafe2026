"use client";

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { MessageSquarePlus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './MyPageInquiries.module.css';

interface InquiryData {
    id: number;
    title: string;
    content: string;
    category: string;
    categoryLabel: string;
    status: string;
    statusLabel: string;
    answer: string | null;
    answeredAt: string | null;
    createdAt: string;
}

const CATEGORIES = [
    { value: 'MENU', label: '메뉴 문의' },
    { value: 'ORDER', label: '주문·결제' },
    { value: 'STORE', label: '매장 이용' },
    { value: 'OTHER', label: '기타' },
];

export default function MyPageInquiries() {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // 폼 상태
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('MENU');

    const fetchInquiries = async () => {
        try {
            const data = await fetchAPI('/inquiries/my');
            setInquiries(data || []);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchInquiries(); }, []);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) return;
        try {
            await fetchAPI('/inquiries', {
                method: 'POST',
                body: JSON.stringify({ title, content, category }),
            });
            toast.success('문의가 등록되었어요! 💌');
            setTitle(''); setContent(''); setCategory('MENU'); setShowForm(false);
            fetchInquiries();
        } catch (e) {
            toast.error('문의 등록에 실패했어요.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('문의를 삭제하시겠어요?')) return;
        try {
            await fetchAPI(`/inquiries/${id}`, { method: 'DELETE' });
            toast.success('문의가 삭제되었어요.');
            fetchInquiries();
        } catch (e) {
            toast.error('삭제에 실패했어요.');
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });

    if (isLoading) return <div className={styles.loading}>불러오는 중...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>1:1 문의</h3>
                <button className={styles.writeBtn} onClick={() => setShowForm(!showForm)}>
                    <MessageSquarePlus size={14} />
                    {showForm ? '취소' : '문의하기'}
                </button>
            </div>

            {/* 문의 작성 폼 */}
            {showForm && (
                <div className={styles.formCard}>
                    <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input
                        className={styles.input}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="문의 내용을 상세히 적어주세요"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={4}
                    />
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={!title.trim() || !content.trim()}
                    >
                        등록하기
                    </button>
                </div>
            )}

            {/* 문의 목록 */}
            {inquiries.length === 0 ? (
                <div className={styles.empty}>
                    <span>💬</span>
                    <p>아직 문의 내역이 없어요</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {inquiries.map(inq => (
                        <div key={inq.id} className={styles.inquiryItem}>
                            <div className={styles.itemHeader} onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}>
                                <div className={styles.itemLeft}>
                                    <span className={`${styles.badge} ${styles[`badge-${inq.status.toLowerCase()}`]}`}>
                                        {inq.statusLabel}
                                    </span>
                                    <span className={styles.catBadge}>{inq.categoryLabel}</span>
                                    <span className={styles.itemTitle}>{inq.title}</span>
                                </div>
                                <div className={styles.itemRight}>
                                    <span className={styles.itemDate}>{formatDate(inq.createdAt)}</span>
                                    {expandedId === inq.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                            </div>

                            {expandedId === inq.id && (
                                <div className={styles.itemBody}>
                                    <p className={styles.itemContent}>{inq.content}</p>

                                    {inq.answer && (
                                        <div className={styles.answerBox}>
                                            <div className={styles.answerLabel}>💜 관리자 답변</div>
                                            <p>{inq.answer}</p>
                                            {inq.answeredAt && <span className={styles.answerDate}>{formatDate(inq.answeredAt)}</span>}
                                        </div>
                                    )}

                                    {inq.status === 'WAITING' && (
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(inq.id)}>
                                            <Trash2 size={13} /> 삭제
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
