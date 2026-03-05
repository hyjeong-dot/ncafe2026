'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
    Upload,
    X,
    Plus,
    Trash2,
    GripVertical,
    ImageIcon,
    Save,
} from 'lucide-react';
import { CategoryResponseDto } from '../CategoryTabs/useCategories';
import styles from './MenuForm.module.css';

// Form data interface
export interface MenuFormData {
    korName: string;
    engName: string;
    description: string;
    price: string;
    categoryId: string;
    isAvailable: boolean;
    isSoldOut: boolean;
}

// Option form data
export interface OptionFormData {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    items: { id: string; name: string; priceDelta: string }[];
}

export interface ImageItem {
    id: string;
    url: string;
    file?: File;
    isPrimary: boolean;
}

interface MenuFormProps {
    initialFormData?: Partial<MenuFormData>;
    initialImages?: ImageItem[];
    initialOptions?: OptionFormData[];
    categories: CategoryResponseDto[];
    onSubmit: (data: MenuFormData, images: ImageItem[], options: OptionFormData[]) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    submitLabel: string;
}

export default function MenuForm({
    initialFormData,
    initialImages = [],
    initialOptions = [],
    categories,
    onSubmit,
    onCancel,
    isSubmitting,
    submitLabel
}: MenuFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState<MenuFormData>({
        korName: initialFormData?.korName || '',
        engName: initialFormData?.engName || '',
        description: initialFormData?.description || '',
        price: initialFormData?.price || '',
        categoryId: initialFormData?.categoryId || '',
        isAvailable: initialFormData?.isAvailable !== undefined ? initialFormData.isAvailable : true,
        isSoldOut: initialFormData?.isSoldOut !== undefined ? initialFormData.isSoldOut : false,
    });

    // Sync formData when initialFormData changes (important for edit mode)
    useEffect(() => {
        if (initialFormData) {
            setFormData(prev => ({
                ...prev,
                ...initialFormData,
                // Ensure values are correct types for inputs
                price: initialFormData.price !== undefined ? String(initialFormData.price) : prev.price,
                categoryId: initialFormData.categoryId !== undefined ? String(initialFormData.categoryId) : prev.categoryId,
            }));
        }
    }, [initialFormData]);

    // Image state
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setImages(initialImages);
        }
    }, [initialImages]);

    // Options state
    const [options, setOptions] = useState<OptionFormData[]>(initialOptions);

    useEffect(() => {
        if (initialOptions && initialOptions.length > 0 && options.length === 0) {
            setOptions(initialOptions);
        }
    }, [initialOptions]);

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

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

        // Clear error when user starts typing
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
            file,
            isPrimary: images.length === 0 && index === 0,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    // Remove image
    const removeImage = (imageId: string) => {
        setImages((prev) => {
            const filtered = prev.filter((img) => img.id !== imageId);
            // If primary image was removed, set the first remaining one as primary
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

    // Options logic...
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

    const removeOption = (optionId: string) => {
        setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
    };

    const updateOption = (optionId: string, field: keyof OptionFormData, value: any) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt))
        );
    };

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

    const removeOptionItem = (optionId: string, itemId: string) => {
        setOptions((prev) =>
            prev.map((opt) =>
                opt.id === optionId
                    ? { ...opt, items: opt.items.filter((item) => item.id !== itemId) }
                    : opt
            )
        );
    };

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

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData, images, options);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
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
                            <option value="">카테고리 선택</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
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
                        메뉴 설명
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="이 메뉴에 대한 설명을 입력하세요..."
                    />
                </div>
            </section>

            {/* Media Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>이미지 설정</h2>

                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.fileInput}
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className={styles.uploadIcon}>
                        <Upload size={32} />
                    </div>
                    <p className={styles.dropzoneText}>클릭하거나 이미지를 드래그하여 업로드하세요</p>
                    <p className={styles.dropzoneHint}>최대 5장의 이미지를 등록할 수 있습니다</p>
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
                                        alt="Menu preview"
                                        fill
                                        className={styles.previewImg}
                                        unoptimized={image.url.startsWith('blob:')}
                                    />
                                    <div className={styles.imageActions}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPrimaryImage(image.id);
                                            }}
                                            className={styles.setPrimaryBtn}
                                            title="대표 이미지로 설정"
                                        >
                                            <ImageIcon size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(image.id);
                                            }}
                                            className={styles.removeImageBtn}
                                            title="이미지 삭제"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    {image.isPrimary && <span className={styles.primaryBadge}>대표 이미지</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Options Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>메뉴 옵션</h2>
                    <button
                        type="button"
                        onClick={addOption}
                        className={styles.addOptionBtn}
                    >
                        <Plus size={18} />
                        <span>옵션 그룹 추가</span>
                    </button>
                </div>

                {options.length === 0 ? (
                    <div className={styles.emptyOptions}>
                        <p>등록된 옵션 그룹이 없습니다.</p>
                        <p className={styles.emptyHint}>"옵션 그룹 추가" 버튼을 눌러 새 옵션을 만들어보세요.</p>
                    </div>
                ) : (
                    <div className={styles.optionsList}>
                        {options.map((option) => (
                            <div key={option.id} className={styles.optionCard}>
                                <div className={styles.optionCardHeader}>
                                    <div className={styles.dragHandle}>
                                        <GripVertical size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={option.name}
                                        onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                                        className={styles.optionNameInput}
                                        placeholder="예: 사이즈 선택, 샷 추가 등"
                                    />
                                    <div className={styles.optionControls}>
                                        <select
                                            value={option.type}
                                            onChange={(e) => updateOption(option.id, 'type', e.target.value)}
                                            className={styles.optionTypeSelect}
                                        >
                                            <option value="radio">단일 선택</option>
                                            <option value="checkbox">다중 선택</option>
                                        </select>
                                        <label className={styles.requiredCheckbox}>
                                            <input
                                                type="checkbox"
                                                checked={option.required}
                                                onChange={(e) => updateOption(option.id, 'required', e.target.checked)}
                                            />
                                            필수 선택
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeOption(option.id)}
                                            className={styles.removeOptionBtn}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.optionItems}>
                                    {option.items.map((item, idx) => (
                                        <div key={item.id} className={styles.optionItem}>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateOptionItem(option.id, item.id, 'name', e.target.value)}
                                                className={styles.itemNameInput}
                                                placeholder={`선택 항목 ${idx + 1}`}
                                            />
                                            <div className={styles.itemPriceWrapper}>
                                                <input
                                                    type="number"
                                                    value={item.priceDelta}
                                                    onChange={(e) => updateOptionItem(option.id, item.id, 'priceDelta', e.target.value)}
                                                    className={styles.itemPriceInput}
                                                    placeholder="0"
                                                />
                                                <span className={styles.itemPriceSuffix}>원</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOptionItem(option.id, item.id)}
                                                disabled={option.items.length <= 1}
                                                className={styles.removeItemBtn}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addOptionItem(option.id)}
                                        className={styles.addItemBtn}
                                    >
                                        <Plus size={16} />
                                        <span>항목 추가</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Status Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>상태 설정</h2>
                <div className={styles.statusGroup}>
                    <label className={styles.statusOption}>
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                        />
                        <div>
                            <span className={styles.statusLabel}>판매 활성화</span>
                            <span className={styles.statusHint}>체크 해제 시 메뉴 목록에 노출되지 않습니다.</span>
                        </div>
                    </label>

                    <label className={styles.statusOption}>
                        <input
                            type="checkbox"
                            name="isSoldOut"
                            checked={formData.isSoldOut}
                            onChange={handleChange}
                        />
                        <div>
                            <span className={styles.statusLabel}>품절 표시</span>
                            <span className={styles.statusHint}>체크 시 "Sold Out" 배지가 표시됩니다.</span>
                        </div>
                    </label>
                </div>
            </section>

            {/* Form Actions */}
            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelBtn}
                    disabled={isSubmitting}
                >
                    취소
                </button>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>저장 중...</>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>{submitLabel}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
