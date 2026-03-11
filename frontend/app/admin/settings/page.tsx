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
                {settings ? (
                    <>
                        <CafeStatusCard 
                            settings={settings}
                            isSaving={isSaving}
                            onUpdateSettings={updateSettings}
                        />
                        <CafeSettingsForm 
                            settings={settings}
                            isSaving={isSaving}
                            onUpdateSettings={updateSettings}
                        />
                    </>
                ) : (
                    <div className={styles.errorContainer}>
                        <p>카페 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
                        <button onClick={() => window.location.reload()} className={styles.refreshBtn}>
                            새로고침
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
