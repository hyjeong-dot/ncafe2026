'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCategories } from '../_components/CategoryTabs/useCategories';
import MenuForm, { MenuFormData, ImageItem, OptionFormData } from '../_components/MenuForm/MenuForm';
import { useMenuSubmit } from '../_components/MenuForm/useMenuSubmit';
import styles from './page.module.css';

export default function NewMenuPage() {
    const router = useRouter();
    const { categories } = useCategories();
    const { createMenu, isSubmitting } = useMenuSubmit();

    const handleSubmit = async (formData: MenuFormData, images: ImageItem[], options: OptionFormData[]) => {
        try {
            await createMenu(formData, images, options);
            router.push('/admin/menus');
        } catch (error) {
            console.error('Submit failed:', error);
        }
    };

    const handleCancel = () => {
        router.push('/admin/menus');
    };

    return (
        <div className={styles.container}>
            <Link href="/admin/menus" className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>목록으로 돌아가기</span>
            </Link>

            <header className={styles.header}>
                <h1 className={styles.title}>새 메뉴 등록</h1>
                <p className={styles.subtitle}>새로운 메뉴를 등록하고 옵션을 설정하세요</p>
            </header>

            <MenuForm
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                submitLabel="메뉴 등록"
            />
        </div>
    );
}
