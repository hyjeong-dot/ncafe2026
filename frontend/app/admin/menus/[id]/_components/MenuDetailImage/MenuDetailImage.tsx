import { useState } from 'react';
import Image from 'next/image';
import { Activity, Zap, Droplet, Cpu, ImageIcon } from 'lucide-react';
import styles from './MenuDetailImage.module.css';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';
import { useMenuImages } from './useMenuImages';

export default function MenuDetailImage({ menuId }: { menuId: number }) {
    const { menu, isLoading: isMenuLoading } = useMenuDetail(menuId);
    const { images, isLoading: isImagesLoading, error } = useMenuImages(menuId);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Nutrition placeholder
    const mockNutrition = {
        calories: 185,
        sugars: 24,
        protein: 5,
        caffeine: 95,
    };

    const currentImage = images[selectedIndex];
    const fallbackAlt = menu?.korName || 'Menu Image';

    if (isMenuLoading || isImagesLoading) return <div className={styles.imageSection}>이미지를 불러오는 중...</div>;
    if (error) return <div className={styles.imageSection}>이미지 로드 오류: {error}</div>;

    return (
        <section className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
                {currentImage ? (
                    <Image
                        src={`http://localhost:8080/${currentImage.srcUrl}`}
                        alt={currentImage.altText || fallbackAlt}
                        fill
                        className={styles.mainImage}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className={styles.noImage}>
                        <ImageIcon size={64} />
                        <span>이미지가 없습니다</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnailList}>
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            className={`${styles.thumbnailItem} ${selectedIndex === index ? styles.activeThumbnail : ''}`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <Image
                                src={`http://localhost:8080/${image.srcUrl}`}
                                alt={`${image.altText || fallbackAlt} ${index + 1}`}
                                fill
                                className={styles.thumbnailImage}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Nutrition Info */}
            <div className={styles.nutritionGrid} style={{ marginTop: '1.5rem' }}>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionIcon}><Activity size={16} /></div>
                    <div className={styles.nutritionInfo}>
                        <span className={styles.nutritionLabel}>칼로리</span>
                        <span className={styles.nutritionValue}>{mockNutrition.calories} kcal</span>
                    </div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionIcon}><Zap size={16} /></div>
                    <div className={styles.nutritionInfo}>
                        <span className={styles.nutritionLabel}>카페인</span>
                        <span className={styles.nutritionValue}>{mockNutrition.caffeine} mg</span>
                    </div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionIcon}><Droplet size={16} /></div>
                    <div className={styles.nutritionInfo}>
                        <span className={styles.nutritionLabel}>당류</span>
                        <span className={styles.nutritionValue}>{mockNutrition.sugars} g</span>
                    </div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionIcon}><Cpu size={16} /></div>
                    <div className={styles.nutritionInfo}>
                        <span className={styles.nutritionLabel}>단백질</span>
                        <span className={styles.nutritionValue}>{mockNutrition.protein} g</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
