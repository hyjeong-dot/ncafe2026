import { useState } from 'react';
import toast from 'react-hot-toast';
import { MenuFormData, ImageItem, OptionFormData } from './MenuForm';

export function useMenuSubmit() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const uploadImages = async (menuId: number, images: ImageItem[]) => {
        let primaryImageId: number | null = null;

        for (const img of images) {
            let currentImageId: number | null = !isNaN(Number(img.id)) ? Number(img.id) : null;

            if (img.file) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', img.file);

                try {
                    const uploadResponse = await fetch('/api/upload-file', {
                        method: 'POST',
                        body: uploadFormData,
                    });

                    if (uploadResponse.ok) {
                        const uploadData = await uploadResponse.json();
                        const srcUrl = uploadData.url;

                        const registerResponse = await fetch(`/api/admin/menus/${menuId}/menu-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                srcUrl: srcUrl,
                                sortOrder: img.isPrimary ? 0 : 1,
                            }),
                        });

                        if (registerResponse.ok) {
                            currentImageId = await registerResponse.json();
                        }
                    }
                } catch (error) {
                    console.error('Image upload failed:', error);
                }
            }

            if (img.isPrimary && currentImageId) {
                primaryImageId = currentImageId;
            }
        }

        if (primaryImageId) {
            await fetch(`/api/admin/menus/${menuId}/menu-images/${primaryImageId}/primary`, {
                method: 'PATCH',
            });
        }
    };

    const createMenu = async (formData: MenuFormData, images: ImageItem[], options: OptionFormData[]) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/admin/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    korName: formData.korName.trim(),
                    engName: formData.engName.trim(),
                    description: formData.description.trim(),
                    price: Number(formData.price),
                    categoryId: Number(formData.categoryId),
                    isAvailable: formData.isAvailable,
                    sortOrder: 0,
                }),
            });

            if (!response.ok) throw new Error('Failed to create menu');
            const menuId = await response.json();

            await uploadImages(menuId, images);

            toast.success('새 메뉴가 등록되었습니다! 💜');
            return menuId;
        } catch (error) {
            toast.error('메뉴 등록에 실패했습니다.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateMenu = async (menuId: number, formData: MenuFormData, images: ImageItem[], initialImages: ImageItem[]) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/menus/${menuId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    korName: formData.korName.trim(),
                    engName: formData.engName.trim(),
                    description: formData.description.trim(),
                    price: Number(formData.price),
                    categoryId: Number(formData.categoryId),
                    isAvailable: formData.isAvailable,
                    isSoldOut: formData.isSoldOut,
                    sortOrder: 0,
                }),
            });

            if (!response.ok) throw new Error('Failed to update menu');

            // Find deleted image IDs
            const initialIds = initialImages.map(img => img.id);
            const currentIds = images.map(img => img.id);
            const deletedIds = initialIds.filter(id => !currentIds.includes(id));

            for (const imageId of deletedIds) {
                if (!isNaN(Number(imageId))) {
                    await fetch(`/api/admin/menus/menu-images/${imageId}`, {
                        method: 'DELETE',
                    });
                }
            }

            await uploadImages(menuId, images);

            toast.success('메뉴 정보가 수정되었습니다! 💜');
            return true;
        } catch (error) {
            toast.error('메뉴 수정에 실패했습니다.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { createMenu, updateMenu, isSubmitting };
}
