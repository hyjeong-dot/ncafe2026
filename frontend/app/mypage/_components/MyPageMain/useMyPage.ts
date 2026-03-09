"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSearchParams } from "next/navigation";

export function useMyPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Check if there is a 'tab' param in URL, else default to 'profile'
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update state if URL query changes
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            toast.error("로그인이 필요한 서비스예요. 💜");
            router.replace("/login?redirect=/mypage");
        }
    }, [user, isLoading, router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'DELETE',
            });
            
            if (response.status === 401 && typeof window !== 'undefined') {
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (response.ok) {
                toast.success('회원 탈퇴가 완료되었습니다. 다음에 다시 만나요! 💜');
                logout();
                router.push('/');
            } else {
                toast.error(data.message || '회원 탈퇴에 실패했어요.');
            }
        } catch (err) {
            toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    return {
        user,
        isLoading,
        activeTab,
        setActiveTab,
        handleLogout,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        handleDeleteAccount,
        router
    };
}
