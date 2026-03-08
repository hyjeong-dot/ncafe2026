'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from '../page.module.css';
import Modal from '@/components/common/Modal/Modal';
import MenuDetailHeader from './MenuDetailHeader/MenuDetailHeader';
import MenuDetailImage from './MenuDetailImage/MenuDetailImage';
import MenuDetailInfo from './MenuDetailInfo/MenuDetailInfo';
import MenuDetailOptions from './MenuDetailOptions/MenuDetailOptions';

interface AdminMenuDetailContainerProps {
    id: number;
}

export default function AdminMenuDetailContainer({ id }: AdminMenuDetailContainerProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`/api/admin/menus/${id}`, {
                method: 'DELETE',
            });
            
            if (response.status === 401) {
                if (typeof window !== 'undefined') window.location.href = '/login';
                return;
            }

            if (!response.ok) throw new Error('메뉴 삭제에 실패했습니다.');

            toast.success('메뉴가 삭제되었습니다.');
            router.push('/admin/menus');
        } catch (error) {
            console.error('Failed to delete menu:', error);
            toast.error('메뉴 삭제에 실패했습니다.');
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <MenuDetailHeader
                id={id}
                onDelete={() => setIsDeleteModalOpen(true)}
            />

            <main className={styles.content}>
                {/* Left Column: Image & Nutrition */}
                <MenuDetailImage menuId={id} />

                {/* Right Column: Info & Options */}
                <div className={styles.infoSection}>
                    <MenuDetailInfo id={id} />
                    <MenuDetailOptions />
                </div>
            </main>

            {/* Deletion Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
