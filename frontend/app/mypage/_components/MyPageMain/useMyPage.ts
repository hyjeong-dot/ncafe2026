"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useMyPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");

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

    return {
        user,
        isLoading,
        activeTab,
        setActiveTab,
        handleLogout,
        router
    };
}
