'use client';

import { AlertCircle } from 'lucide-react';
import { CafeSettings } from './useCafeSettings';
import styles from '../page.module.css';

interface CafeStatusCardProps {
    settings: CafeSettings | null;
    isSaving: boolean;
    onUpdateSettings: (newSettings: Partial<CafeSettings>) => Promise<boolean>;
}

export default function CafeStatusCard({ settings, isSaving, onUpdateSettings }: CafeStatusCardProps) {
    const handleToggleManualClose = async () => {
        const newStatus = !settings?.manualClosed;
        const confirmMsg = newStatus 
            ? "영업을 강제로 마감하시겠몽? (._.)" 
            : "다시 영업을 시작하시겠몽? 🪄";
        
        if (confirm(confirmMsg)) {
            await onUpdateSettings({ manualClosed: newStatus });
        }
    };

    return (
        <div className={styles.statusCard}>
            <div className={styles.statusIndicator}>
                {settings?.open ? '☕' : '💤'}
            </div>
            <h2 className={styles.statusTitle}>현재 카페 상태</h2>
            <div className={`${styles.statusBadge} ${settings?.open ? styles.openBadge : styles.closedBadge}`}>
                {settings?.open ? '영업 중' : '영업 종료'}
            </div>
            
            <button 
                className={`${styles.toggleBtn} ${settings?.manualClosed ? styles.btnOpen : styles.btnClose}`}
                onClick={handleToggleManualClose}
                disabled={isSaving || (!settings?.open && !settings?.manualClosed)}
                style={(!settings?.open && !settings?.manualClosed) ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#ccc', boxShadow: 'none' } : {}}
            >
                {settings?.manualClosed 
                    ? '마감 상태 해제하기 🪄' 
                    : (!settings?.open ? '영업 준비 중 (시간 마감) 💤' : '지금 강제 마감하기 ❌')}
            </button>
            
            {settings?.manualClosed && (
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#e74c3c' }}>
                    <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    현재 강제 마감 상태입니다.
                </p>
            )}
        </div>
    );
}
