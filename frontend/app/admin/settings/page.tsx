'use client';

import { useCafeSettings } from './_components/useCafeSettings';
import CafeStatusCard from './_components/CafeStatusCard';
import CafeSettingsForm from './_components/CafeSettingsForm';
import styles from './page.module.css';
import DashboardLoading from '../_components/DashboardLoading';

export default function CafeSettingsPage() {
    const { settings, isLoading, isSaving, updateSettings } = useCafeSettings();

    if (isLoading) return <DashboardLoading />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>카페 설정 ⚙️</h1>

            <div className={styles.settingsGrid}>
                {/* 현재 영업 상태 제어 카드 */}
                <CafeStatusCard 
                    settings={settings}
                    isSaving={isSaving}
                    onUpdateSettings={updateSettings}
                />

                {/* 상세 정보 설정 폼 */}
                {settings && (
                    <CafeSettingsForm 
                        settings={settings}
                        isSaving={isSaving}
                        onUpdateSettings={updateSettings}
                    />
                )}
            </div>
        </div>
    );
}
