import Image from 'next/image';
import { Activity, Zap, Droplet, Cpu, ImageIcon } from 'lucide-react';
import styles from './MenuDetailImage.module.css';

export default function MenuDetailImage() {
    // Mock Data for Nutrition
    const mockNutrition = {
        calories: 185,
        sugars: 24,
        protein: 5,
        caffeine: 95,
    };

    const imageUrl = '';
    const altText = 'Menu Image';

    return (
        <section className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={altText}
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
