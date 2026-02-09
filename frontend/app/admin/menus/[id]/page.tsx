'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
import styles from './page.module.css';
// import Modal from '@/components/common/Modal/Modal';
import MenuDetailHeader from './_components/MenuDetailHeader/MenuDetailHeader';
import MenuDetailImage from './_components/MenuDetailImage/MenuDetailImage';
import MenuDetailInfo from './_components/MenuDetailInfo/MenuDetailInfo';
import MenuDetailOptions from './_components/MenuDetailOptions/MenuDetailOptions';

// Next.js 15+ compatible props type
// interface MenuDetailPageProps {
//     params: Promise<{
//         id: string;
//     }>;
// }

export default function MenuDetailPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const router = useRouter();

    // const menu = useMenuStore((state) => state.getMenuById(id));
    // Data Fetching Plan: Will use API fetch in the future. Currently using Mock Data.

    // const deleteMenuFromStore = useMenuStore((state) => state.deleteMenu);

    // 백엔드에서 데이터 fetch (새로고침 시 store가 비어있을 수 있음)
    // 실제 구현 시에는 react-query 등을 사용하거나 useEffect에서 fetch 로직이 필요할 수 있음
    // 현재는 store에 없으면 notFound 처리 중 -> 이 부분은 추후 보완 필요할 수 있음.
    // 우선 store 로직 유지.

    return (
        <div className={styles.container}>
            <MenuDetailHeader
            />

            <main className={styles.content}>
                {/* Left Column: Image & Nutrition */}
                <MenuDetailImage menuId={id}
                />

                {/* Right Column: Info & Options */}
                <div className={styles.infoSection}>
                    <MenuDetailInfo id={id}
                    />

                    <MenuDetailOptions
                    />
                </div>
            </main>

            {/* <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={handleConfirmDelete}
            /> */}
        </div>
    );
}
