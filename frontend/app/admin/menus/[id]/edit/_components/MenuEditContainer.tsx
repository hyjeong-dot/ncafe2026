'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '../../../_components/CategoryTabs/useCategories';
import { useMenuDetail, MenuImageDetail, MenuOptionDetail } from '../../_components/MenuDetailInfo/useMenuDetail';
import MenuForm, { MenuFormData, ImageItem, OptionFormData } from '../../../_components/MenuForm/MenuForm';
import { useMenuSubmit } from '../../../_components/MenuForm/useMenuSubmit';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';
import { getImageSrc } from '@/lib/api';
import styles from '../page.module.css';

interface MenuEditContainerProps {
    menuId: number;
}

export default function MenuEditContainer({ menuId }: MenuEditContainerProps) {
    const router = useRouter();
    const { menu, isLoading: isMenuLoading } = useMenuDetail(menuId);
    const { categories } = useCategories();
    const { updateMenu, isSubmitting } = useMenuSubmit();

    const [isInitialized, setIsInitialized] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState<Partial<MenuFormData>>({});
    const [initialImages, setInitialImages] = useState<ImageItem[]>([]);
    const [initialOptions, setInitialOptions] = useState<OptionFormData[]>([]);

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

            if (menu.images && menu.images.length > 0) {
                setInitialImages(menu.images.map((img: MenuImageDetail) => ({
                    id: String(img.id),
                    url: getImageSrc(img.srcUrl),
                    isPrimary: img.sortOrder === 0
                })));
            } else if (menu.imageSrc && menu.imageSrc !== 'blank.png') {
                setInitialImages([{
                    id: 'original',
                    url: getImageSrc(menu.imageSrc),
                    isPrimary: true
                }]);
            }

            // 옵션 데이터 매핑
            if (menu.options && menu.options.length > 0) {
                setInitialOptions(menu.options.map((opt: MenuOptionDetail) => ({
                    id: String(opt.id),
                    name: opt.name,
                    type: opt.isMultiSelect ? 'checkbox' as const : 'radio' as const,
                    required: opt.isRequired,
                    items: opt.items.map(item => ({
                        id: String(item.id),
                        name: item.name,
                        priceDelta: String(item.priceDelta)
                    }))
                })));
            }

            setIsInitialized(true);
        }
    }, [menu, categories, isInitialized]);

    const handleSubmit = async (formData: MenuFormData, images: ImageItem[]) => {
        try {
            await updateMenu(menuId, formData, images, initialImages);
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
            <div className={styles.loadingWrapper}>
                <LoadingDitto message="메뉴 정보를 불러오는 중..." />
            </div>
        );
    }

    if (!menu && !isMenuLoading) {
        return (
            <div className={styles.errorWrapper}>
                <p>메뉴를 찾을 수 없습니다.</p>
                <button onClick={() => router.push('/admin/menus')} className={styles.backBtn}>
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <>
            {isInitialized && (
                <MenuForm
                    initialFormData={initialFormValues}
                    initialImages={initialImages}
                    initialOptions={initialOptions}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    submitLabel="변경사항 저장"
                />
            )}
        </>
    );
}
