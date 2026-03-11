'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CafeSettings {
    cafeName: string;
    description: string;
    phoneNumber: string;
    address: string;
    openTime: string; // "HH:mm:ss"
    closeTime: string; // "HH:mm:ss"
    manualClosed: boolean;
    instagramUrl: string;
    open: boolean;
}

export function useCafeSettings() {
    const [settings, setSettings] = useState<CafeSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            if (response.status === 401) {
                if (typeof window !== 'undefined') window.location.href = '/login';
                return;
            }
            if (!response.ok) throw new Error('설정을 불러오는데 실패했습니다.');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Fetch settings error:', error);
            toast.error('카페 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<CafeSettings>) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...settings, ...newSettings }),
            });

            if (!response.ok) throw new Error('설정 저장 실패');

            const updated = await response.json();
            setSettings(updated);
            toast.success('카페 설정이 저장되었습니다! 🪄');
            return true;
        } catch (error) {
            console.error('Update settings error:', error);
            toast.error('설정 저장 중 오류가 발생했습니다.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        isLoading,
        isSaving,
        updateSettings,
        refresh: fetchSettings
    };
}
