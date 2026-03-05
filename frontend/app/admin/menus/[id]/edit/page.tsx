'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Trash2,
    GripVertical,
    ImageIcon,
    Save,
} from 'lucide-react';
import { useCategories } from '../../_components/CategoryTabs/useCategories';
import { useMenuDetail } from '../_components/MenuDetailInfo/useMenuDetail';
import styles from './page.module.css';
import { use } from 'react';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';
import { getImageSrc } from '@/lib/api';

// Form data interface
interface MenuFormData {
    korName: string;
    engName: string;
    description: string;
    price: string;
    categoryId: string;
    isAvailable: boolean;
    isSoldOut: boolean;
}

// Option form data
interface OptionFormData {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    items: { id: string; name: string; priceDelta: string }[];
}

// Props type
interface EditMenuPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = use(params);
    const menuId = Number(id);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // API에서 메뉴 데이터, 카테고리 데이터 fetch
    const { menu, isLoading: isMenuLoading } = useMenuDetail(menuId);
    const { categories } = useCategories();

    // Loading state for redirect after not found
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<MenuFormData>({
        korName: '',
        engName: '',
        description: '',
        price: '',
        categoryId: '',
        isAvailable: true,
        isSoldOut: false,
    });

    // Image state
    const [images, setImages] = useState<{ id: string; url: string; file?: File; isPrimary: boolean }[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Options state
    const [options, setOptions] = useState<OptionFormData[]>([]);

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form with existing menu data from API
    useEffect(() => {
        if (menu && categories.length > 0 && !isInitialized) {
            // categoryName으로 카테고리 ID 찾기
            const matchedCategory = categories.find((cat) => cat.name === menu.categoryName);

            setFormData({
                korName: menu.korName,
                engName: menu.engName,
                description: menu.description || '',
                price: String(menu.price),
                categoryId: matchedCategory ? String(matchedCategory.id) : '',
                isAvailable: menu.isAvailable,
                isSoldOut: menu.isSoldOut,
            });

            // 원본 이미지가 있으면 상태에 반영
            if (menu.imageSrc && menu.imageSrc !== 'blank.png') {
                setImages([{
                    id: 'original',
                    url: getImageSrc(menu.imageSrc),
                    isPrimary: true
                }]);
            }

            setIsInitialized(true);
        }
    }, [menu, categories, isInitialized]);

    // Handle menu not found
    if (!isMenuLoading && !menu) {
        return (
            <div className={styles.container}>
                <div className={styles.errorWrapper}>
                    <p>메뉴를 찾을 수 없거나 불러오는 데 실패했습니다.</p>
                    <button onClick={() => router.push('/admin/menus')} className={styles.backBtn}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isMenuLoading) {
        return (
            <div className={styles.container}>
                <LoadingDitto message="메뉴 정보를 불러오는 중..." />
            </div>
        );
    }

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Handle image drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith('image/')
        );

        const newImages = files.map((file, index) => ({
            id: `img-${Date.now()}-${index}`,
            url: URL.createObjectURL(file),
            file,
            isPrimary: images.length === 0 && index === 0,
        }));
        setImages((prev) => [...prev, ...newImages]);
    }, [images.length]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map((file, index) => ({
            id: `img-${Date.now()}-${index}`,
            url: URL.createObjectURL(file),
            isPrimary: images.length === 0 && index === 0,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    // Remove image
    const removeImage = (imageId: string) => {
        setImages((prev) => {
            const filtered = prev.filter((img) => img.id !== imageId);
            if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
                filtered[0].isPrimary = true;
            }
            return filtered;
        });
    };

    // Set primary image
    const setPrimaryImage = (imageId: string) => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                isPrimary: img.id === imageId,
            }))
        );
    };

    // Add new option group
    const addOption = () => {
        const newOption: OptionFormData = {
            id: `opt-${Date.now()}`,
            name: '',
            type: 'radio',
            required: false,
            items: [{ id: `item-${Date.now()}`, name: '', priceDelta: '0' }],
        };
        setOptions((prev) => [...prev, newOption]);
    };

    // Remove option group
    const removeOption = (optionId: string) => {
        setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
    };

    // Update option
    const updateOption = (optionId: string, field: keyof OptionFormData, value: unknown) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt))
        );
    };

    // Add option item
    const addOptionItem = (optionId: string) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === optionId
                    ? {
                        ...opt,
                        items: [
                            ...opt.items,
                            { id: `item-${Date.now()}`, name: '', priceDelta: '0' },
                        ],
                    }
                    : opt
            )
        );
    };

    // Remove option item
    const removeOptionItem = (optionId: string, itemId: string) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === optionId
                    ? { ...opt, items: opt.items.filter((item) => item.id !== itemId) }
                    : opt
            )
        );
    };

    // Update option item
    const updateOptionItem = (
        optionId: string,
        itemId: string,
        field: 'name' | 'priceDelta',
        value: string
    ) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === optionId
                    ? {
                        ...opt,
                        items: opt.items.map((item) =>
                            item.id === itemId ? { ...item, [field]: value } : item
                        ),
                    }
                    : opt
            )
        );
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.korName.trim()) {
            newErrors.korName = '메뉴명(한글)을 입력해주세요';
        }
        if (!formData.engName.trim()) {
            newErrors.engName = '메뉴명(영문)을 입력해주세요';
        }
        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = '유효한 가격을 입력해주세요';
        }
        if (!formData.categoryId) {
            newErrors.categoryId = '카테고리를 선택해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. 메뉴 기본 정보 수정
            const response = await fetch(`/api/admin/menus/${id}`, {
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

            if (!response.ok) {
                throw new Error('메뉴 수정에 실패했습니다.');
            }

            // 2. 새로운 이미지가 업로드된 경우 이미지 저장
            for (const img of images) {
                if (img.file) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', img.file);

                    const uploadRes = await fetch('/api/upload-file', {
                        method: 'POST',
                        body: uploadFormData,
                    });

                    if (uploadRes.ok) {
                        const { url } = await uploadRes.json();

                        // 연관 관계 생성 (id는 URL의 id)
                        await fetch(`/api/admin/menus/${id}/menu-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                srcUrl: url,
                                sortOrder: 1
                            }),
                        });
                    }
                }
            }

            toast.success('메뉴 정보가 수정되었습니다! 💜');
            router.push(`/admin/menus/${id}`);
        } catch (error) {
            console.error('Error updating menu:', error);
            toast.error('메뉴 수정에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <Link href={`/admin/menus/${id}`} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>상세 페이지로 돌아가기</span>
            </Link>

            <header className={styles.header}>
                <h1 className={styles.title}>메뉴 수정</h1>
                <p className={styles.subtitle}>{formData.korName || '메뉴'} 정보를 수정합니다</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Basic Info Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>기본 정보</h2>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="korName" className={styles.label}>
                                메뉴명 (한글) <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="korName"
                                name="korName"
                                value={formData.korName}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.korName ? styles.inputError : ''}`}
                                placeholder="예: 아메리카노"
                            />
                            {errors.korName && (
                                <span className={styles.errorText}>{errors.korName}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="engName" className={styles.label}>
                                메뉴명 (영문) <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="engName"
                                name="engName"
                                value={formData.engName}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.engName ? styles.inputError : ''}`}
                                placeholder="예: Americano"
                            />
                            {errors.engName && (
                                <span className={styles.errorText}>{errors.engName}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="price" className={styles.label}>
                                가격 <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.priceInput}>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                    placeholder="0"
                                    min="0"
                                />
                                <span className={styles.priceSuffix}>원</span>
                            </div>
                            {errors.price && (
                                <span className={styles.errorText}>{errors.price}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="categoryId" className={styles.label}>
                                카테고리 <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`${styles.select} ${errors.categoryId ? styles.inputError : ''}`}
                            >
                                <option value="">카테고리를 선택해주세요</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className={styles.errorText}>{errors.categoryId}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>
                            설명
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="메뉴에 대한 설명을 입력하세요"
                            rows={3}
                        />
                    </div>
                </section>

                {/* Image Upload Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>이미지</h2>

                    <div
                        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                        <Upload size={48} className={styles.uploadIcon} />
                        <p className={styles.dropzoneText}>
                            이미지를 드래그하거나 클릭하여 업로드
                        </p>
                        <p className={styles.dropzoneHint}>
                            JPG, PNG, GIF (최대 5MB)
                        </p>
                    </div>

                    {images.length > 0 && (
                        <div className={styles.imagePreviewGrid}>
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className={`${styles.imagePreview} ${image.isPrimary ? styles.primaryImage : ''}`}
                                >
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={image.url}
                                            alt="Preview"
                                            fill
                                            className={styles.previewImg}
                                        />
                                    </div>
                                    <div className={styles.imageActions}>
                                        {!image.isPrimary && (
                                            <button
                                                type="button"
                                                className={styles.setPrimaryBtn}
                                                onClick={() => setPrimaryImage(image.id)}
                                                title="대표 이미지로 설정"
                                            >
                                                <ImageIcon size={16} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className={styles.removeImageBtn}
                                            onClick={() => removeImage(image.id)}
                                            title="이미지 삭제"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    {image.isPrimary && (
                                        <span className={styles.primaryBadge}>대표</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Options Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>옵션 관리</h2>
                        <button
                            type="button"
                            className={styles.addOptionBtn}
                            onClick={addOption}
                        >
                            <Plus size={18} />
                            옵션 그룹 추가
                        </button>
                    </div>

                    {options.length === 0 ? (
                        <div className={styles.emptyOptions}>
                            <p>등록된 옵션이 없습니다.</p>
                            <p className={styles.emptyHint}>
                                사이즈, 샷 추가 등의 옵션을 추가해보세요
                            </p>
                        </div>
                    ) : (
                        <div className={styles.optionsList}>
                            {options.map((option) => (
                                <div key={option.id} className={styles.optionCard}>
                                    <div className={styles.optionCardHeader}>
                                        <GripVertical
                                            size={20}
                                            className={styles.dragHandle}
                                        />
                                        <input
                                            type="text"
                                            value={option.name}
                                            onChange={(e) =>
                                                updateOption(option.id, 'name', e.target.value)
                                            }
                                            className={styles.optionNameInput}
                                            placeholder="옵션 그룹명 (예: 사이즈)"
                                        />
                                        <div className={styles.optionControls}>
                                            <select
                                                value={option.type}
                                                onChange={(e) =>
                                                    updateOption(
                                                        option.id,
                                                        'type',
                                                        e.target.value as 'radio' | 'checkbox'
                                                    )
                                                }
                                                className={styles.optionTypeSelect}
                                            >
                                                <option value="radio">단일 선택</option>
                                                <option value="checkbox">다중 선택</option>
                                            </select>
                                            <label className={styles.requiredCheckbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={option.required}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            option.id,
                                                            'required',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                필수
                                            </label>
                                            <button
                                                type="button"
                                                className={styles.removeOptionBtn}
                                                onClick={() => removeOption(option.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.optionItems}>
                                        {option.items.map((item) => (
                                            <div key={item.id} className={styles.optionItem}>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        updateOptionItem(
                                                            option.id,
                                                            item.id,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                    className={styles.itemNameInput}
                                                    placeholder="옵션명 (예: Large)"
                                                />
                                                <div className={styles.itemPriceWrapper}>
                                                    <input
                                                        type="number"
                                                        value={item.priceDelta}
                                                        onChange={(e) =>
                                                            updateOptionItem(
                                                                option.id,
                                                                item.id,
                                                                'priceDelta',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={styles.itemPriceInput}
                                                        placeholder="0"
                                                    />
                                                    <span className={styles.itemPriceSuffix}>
                                                        원
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.removeItemBtn}
                                                    onClick={() =>
                                                        removeOptionItem(option.id, item.id)
                                                    }
                                                    disabled={option.items.length <= 1}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className={styles.addItemBtn}
                                            onClick={() => addOptionItem(option.id)}
                                        >
                                            <Plus size={16} />
                                            항목 추가
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Status Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>판매 상태</h2>

                    <div className={styles.statusGroup}>
                        <label className={styles.statusOption}>
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                            />
                            <span className={styles.statusLabel}>판매 활성화</span>
                            <span className={styles.statusHint}>
                                체크 해제 시 고객에게 표시되지 않습니다
                            </span>
                        </label>

                        <label className={styles.statusOption}>
                            <input
                                type="checkbox"
                                name="isSoldOut"
                                checked={formData.isSoldOut}
                                onChange={handleChange}
                            />
                            <span className={styles.statusLabel}>품절 처리</span>
                            <span className={styles.statusHint}>
                                품절 상태로 표시됩니다
                            </span>
                        </label>
                    </div>
                </section>

                {/* Submit Actions */}
                <div className={styles.formActions}>
                    <Link href={`/admin/menus/${id}`} className={styles.cancelBtn}>
                        취소
                    </Link>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        <Save size={20} />
                        {isSubmitting ? '저장 중...' : '변경사항 저장'}
                    </button>
                </div>
            </form>
        </div>
    );
}
