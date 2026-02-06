'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './page.module.css';
import Modal from '@/components/common/Modal/Modal';
import MenuDetailHeader from './_components/MenuDetailHeader/MenuDetailHeader';
import MenuDetailImage from './_components/MenuDetailImage/MenuDetailImage';
import MenuDetailInfo from './_components/MenuDetailInfo/MenuDetailInfo';
import MenuDetailOptions from './_components/MenuDetailOptions/MenuDetailOptions';

// Next.js 15+ compatible props type
interface MenuDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // const menu = useMenuStore((state) => state.getMenuById(id));
    // Data Fetching Plan: Will use API fetch in the future. Currently using Mock Data.

    // Mock Data Definition
    const menu = {
        id: '1',
        korName: '아이스 아메리카노',
        engName: 'Iced Americano',
        description: '진한 에스프레소와 시원한 물이 어우러진 깔끔한 맛의 커피',
        price: 4500,
        category: {
            id: 'coffee',
            korName: '커피',
            engName: 'Coffee',
            icon: '☕',
            sortOrder: 1
        },
        images: [
            { id: 'img1', url: '/images/menu/americano.jpg', isPrimary: true, sortOrder: 1 }
        ],
        isSoldOut: false,
        isAvailable: true,
        options: [
            {
                id: 'opt1',
                name: '샷 추가',
                type: 'checkbox' as const,
                required: false,
                items: [
                    { id: 'item1', name: '1샷 추가', priceDelta: 500 },
                    { id: 'item2', name: '2샷 추가', priceDelta: 1000 }
                ]
            },
            {
                id: 'opt2',
                name: '시럽 선택',
                type: 'radio' as const,
                required: true,
                items: [
                    { id: 'item3', name: '설탕 시럽', priceDelta: 0 },
                    { id: 'item4', name: '헤이즐넛 시럽', priceDelta: 500 }
                ]
            }
        ],
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // const deleteMenuFromStore = useMenuStore((state) => state.deleteMenu);

    // 백엔드에서 데이터 fetch (새로고침 시 store가 비어있을 수 있음)
    // 실제 구현 시에는 react-query 등을 사용하거나 useEffect에서 fetch 로직이 필요할 수 있음
    // 현재는 store에 없으면 notFound 처리 중 -> 이 부분은 추후 보완 필요할 수 있음.
    // 우선 store 로직 유지.

    // If deleting, show nothing (will redirect soon)
    if (isDeleting) {
        return null;
    }

    // Store에 데이터가 없으면 로딩 중이거나 에러일 수 있음
    // 여기서는 예시로 notFound 처리 (실제 앱에서는 fetch 로직 필요)
    if (!menu) {
        // 실제로는 여기서 fetch를 시도하거나 해야 함.
        // 임시로 notFound();
        // notFound(); 
        // 404 에러 방지를 위해, 데이터가 없으면 로딩중 표시 혹은 fetch 시도 로직을 넣어야 하지만
        // 현재 store 기반 구조이므로 일단 return null 하거나 notFound 유지
        return <div className={styles.container}>메뉴 정보를 불러오는 중입니다...</div>;
        // notFound();
    }

    const primaryImage = menu.images.find((img) => img.isPrimary) || menu.images[0];

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        // deleteMenuFromStore(id); // Mock delete
        console.log('Mock delete menu:', id);
        toast.success('메뉴가 삭제되었습니다.');
        router.push('/admin/menus');
    };

    return (
        <div className={styles.container}>
            <MenuDetailHeader
                menuId={menu.id}
                onDeleteClick={handleDeleteClick}
            />

            <main className={styles.content}>
                {/* Left Column: Image & Nutrition */}
                <MenuDetailImage
                    imageUrl={primaryImage?.url}
                    altText={menu.korName}
                />

                {/* Right Column: Info & Options */}
                <div className={styles.infoSection}>
                    <MenuDetailInfo
                        menu={menu}
                    />

                    <MenuDetailOptions options={menu.options} />
                </div>
            </main>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="메뉴 삭제"
                description="정말로 이 메뉴를 삭제하시겠습니까? 삭제된 메뉴는 복구할 수 없습니다."
                confirmText="삭제"
                variant="danger"
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
