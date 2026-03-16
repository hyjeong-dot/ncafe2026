import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface InquiryData {
    id: number;
    nickname: string;
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

export function useAdminInquiries() {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInquiries = useCallback(async (status?: string) => {
        try {
            const url = status ? `/api/admin/inquiries?status=${status}` : '/api/admin/inquiries';
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed');
            setInquiries(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

    const answerInquiry = async (id: number, answer: string) => {
        const res = await fetch(`/api/admin/inquiries/${id}/answer`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer }),
        });
        if (!res.ok) throw new Error('답변 실패');
        toast.success('답변이 등록되었어요! 💌');
        await fetchInquiries();
    };

    return { inquiries, isLoading, fetchInquiries, answerInquiry };
}
