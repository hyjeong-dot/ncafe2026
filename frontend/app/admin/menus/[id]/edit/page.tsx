'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCategories } from '../../_components/CategoryTabs/useCategories';
import { useMenuDetail } from '../_components/MenuDetailInfo/useMenuDetail';
import MenuForm, { MenuFormData, ImageItem, OptionFormData } from '../../_components/MenuForm/MenuForm';
import { useMenuSubmit } from '../../_components/MenuForm/useMenuSubmit';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';
import { getImageSrc } from '@/lib/api';
import styles from './page.module.css';

interface EditMenuPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = use(params);
    const menuId = Number(id);
    const router = useRouter();

    const { menu, isLoading: isMenuLoading } = useMenuDetail(menuId);
    const { categories } = useCategories();
    const { updateMenu, isSubmitting } = useMenuSubmit();

    const [isInitialized, setIsInitialized] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState<Partial<MenuFormData>>({});
    const [initialImages, setInitialImages] = useState<ImageItem[]>([]);

    useEffect(() => {
        if (menu && categories.length > 0 && !isInitialized) {
            const matchedCategory = categories.find((cat) => cat.name === menu.categoryName);

            setInitialFormValues({
                korName: menu.korName,
                engName: menu.engName,
                description: menu.description || '',
                price: String(menu.price),
                categoryId: matchedCategory ? String(matchedCategory.id) : '',
                isAvailable: menu.isAvailable,
                isSoldOut: menu.isSoldOut,
            });

            if (menu.imageSrc && menu.imageSrc !== 'blank.png') {
                setInitialImages([{
                    id: 'original',
                    url: getImageSrc(menu.imageSrc),
                    isPrimary: true
                }]);
            }

            setIsInitialized(true);
        }
    }, [menu, categories, isInitialized]);

    const handleSubmit = async (formData: MenuFormData, images: ImageItem[], options: OptionFormData[]) => {
        try {
            await updateMenu(menuId, formData, images, options);
            router.push(`/admin/menus/${menuId}`);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/menus/${menuId}`);
    };

    if (isMenuLoading) {
        return (
            <div className={styles.container}>
                <LoadingDitto message="메뉴 정보를 불러오는 중..." />
            </div>
        );
    }

    if (!menu && !isMenuLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.errorWrapper}>
                    <p>메뉴를 찾을 수 없습니다.</p>
                    <button onClick={() => router.push('/admin/menus')} className={styles.backBtn}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href={`/admin/menus/${menuId}`} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>상세 페이지로 돌아가기</span>
            </Link>

            <header className={styles.header}>
                <h1 className={styles.title}>메뉴 수정</h1>
                <p className={styles.subtitle}>메뉴 정보를 수정합니다</p>
            </header>

            {isInitialized && (
                <MenuForm
                    initialFormData={initialFormValues}
                    initialImages={initialImages}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    submitLabel="변경사항 저장"
                />
            )}
        </div>
    );
}
