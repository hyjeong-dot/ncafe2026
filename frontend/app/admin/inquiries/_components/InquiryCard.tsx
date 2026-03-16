'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { InquiryData } from './useAdminInquiries';
import styles from '../page.module.css';

interface InquiryCardProps {
    inquiry: InquiryData;
    onAnswer: (id: number, answer: string) => void;
}

export default function InquiryCard({ inquiry, onAnswer }: InquiryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [answerText, setAnswerText] = useState(inquiry.answer || '');

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        + ' ' + new Date(d).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`${styles.card} ${inquiry.status === 'WAITING' ? styles.cardWaiting : ''}`}>
            <div className={styles.cardHeader} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={styles.headerLeft}>
                    <span className={`${styles.statusBadge} ${styles[`badge-${inquiry.status.toLowerCase()}`]}`}>
                        {inquiry.statusLabel}
                    </span>
                    <span className={styles.categoryBadge}>{inquiry.categoryLabel}</span>
                    <span className={styles.inquiryTitle}>{inquiry.title}</span>
                </div>
                <div className={styles.headerRight}>
                    <span className={styles.meta}>{inquiry.nickname}</span>
                    <span className={styles.meta}>{formatDate(inquiry.createdAt)}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {isExpanded && (
                <div className={styles.cardBody}>
                    <div className={styles.contentSection}>
                        <div className={styles.sectionLabel}>문의 내용</div>
                        <p className={styles.contentText}>{inquiry.content}</p>
                    </div>

                    <div className={styles.answerSection}>
                        <div className={styles.sectionLabel}>
                            {inquiry.status === 'ANSWERED' ? '답변' : '답변 작성'}
                        </div>
                        {inquiry.status === 'ANSWERED' ? (
                            <div className={styles.answerBox}>
                                <p>{inquiry.answer}</p>
                                <span className={styles.answerDate}>
                                    {inquiry.answeredAt && formatDate(inquiry.answeredAt)}
                                </span>
                            </div>
                        ) : (
                            <div className={styles.answerForm}>
                                <textarea
                                    className={styles.answerTextarea}
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="답변을 입력하세요..."
                                    rows={4}
                                />
                                <button
                                    className={styles.sendBtn}
                                    onClick={() => onAnswer(inquiry.id, answerText)}
                                    disabled={!answerText.trim()}
                                >
                                    <Send size={14} /> 답변 등록
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
