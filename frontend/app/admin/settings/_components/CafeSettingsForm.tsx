'use client';

import { useState, useEffect } from 'react';
import { Save, Coffee, Clock, MapPin, Phone, Instagram } from 'lucide-react';
import { CafeSettings } from './useCafeSettings';
import styles from '../page.module.css';

interface CafeSettingsFormProps {
    settings: CafeSettings;
    isSaving: boolean;
    onUpdateSettings: (newSettings: Partial<CafeSettings>) => Promise<boolean>;
}

export default function CafeSettingsForm({ settings, isSaving, onUpdateSettings }: CafeSettingsFormProps) {
    const [formData, setFormData] = useState({
        cafeName: '',
        description: '',
        phoneNumber: '',
        address: '',
        openTime: '',
        closeTime: '',
        instagramUrl: '',
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                cafeName: settings.cafeName,
                description: settings.description || '',
                phoneNumber: settings.phoneNumber || '',
                address: settings.address || '',
                openTime: settings.openTime ? settings.openTime.substring(0, 5) : '09:00',
                closeTime: settings.closeTime ? settings.closeTime.substring(0, 5) : '22:00',
                instagramUrl: settings.instagramUrl || '',
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdateSettings({
            ...formData,
            openTime: formData.openTime + ":00",
            closeTime: formData.closeTime + ":00"
        });
    };

    return (
        <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label><Coffee size={16} /> 카페 이름</label>
                    <input 
                        type="text" 
                        name="cafeName" 
                        value={formData.cafeName} 
                        onChange={handleChange} 
                        className={styles.input} 
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>매장 설명 / 공지</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.timeRow}>
                    <div className={styles.formGroup}>
                        <label><Clock size={16} /> 오픈 시간</label>
                        <input 
                            type="time" 
                            name="openTime" 
                            value={formData.openTime} 
                            onChange={handleChange} 
                            className={styles.input} 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label><Clock size={16} /> 마감 시간</label>
                        <input 
                            type="time" 
                            name="closeTime" 
                            value={formData.closeTime} 
                            onChange={handleChange} 
                            className={styles.input} 
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label><MapPin size={16} /> 매장 주소</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        className={styles.input} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label><Phone size={16} /> 연락처</label>
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className={styles.input} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label><Instagram size={16} /> SNS (Instagram)</label>
                    <input 
                        type="text" 
                        name="instagramUrl" 
                        value={formData.instagramUrl} 
                        onChange={handleChange} 
                        className={styles.input} 
                        placeholder="https://instagram.com/..."
                    />
                </div>

                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                    <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    {isSaving ? '저장 중...' : '설정 저장하기'}
                </button>
            </form>
        </div>
    );
}
