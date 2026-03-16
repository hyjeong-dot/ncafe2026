'use client';

import { useState, useMemo } from 'react';
import { useAdminInquiries } from './_components/useAdminInquiries';
import InquiryToolbar from './_components/InquiryToolbar';
import InquiryCard from './_components/InquiryCard';
import DashboardLoading from '../_components/DashboardLoading';
import styles from './page.module.css';

export default function AdminInquiriesPage() {
    const { inquiries, isLoading, answerInquiry } = useAdminInquiries();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filtered = useMemo(() => {
        let result = inquiries;
        if (statusFilter) result = result.filter(i => i.status === statusFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.content.toLowerCase().includes(q) ||
                i.nickname.toLowerCase().includes(q)
            );
        }
        return result;
    }, [inquiries, searchQuery, statusFilter]);

    if (isLoading) return <DashboardLoading />;

    const waitingCount = inquiries.filter(i => i.status === 'WAITING').length;

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.title}>문의 관리</h1>
                {waitingCount > 0 && (
                    <span className={styles.waitingBadge}>⏳ 미답변 {waitingCount}건</span>
                )}
            </div>

            <InquiryToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                resultCount={filtered.length}
            />

            <div className={styles.list}>
                {filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>💬</span>
                        <p>문의가 없습니다.</p>
                    </div>
                ) : (
                    filtered.map(inq => (
                        <InquiryCard key={inq.id} inquiry={inq} onAnswer={answerInquiry} />
                    ))
                )}
            </div>
        </div>
    );
}
