'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './MenuDetailImage.module.css';
import { useMenuImages } from './useMenuImages';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';
import { getImageSrc } from '@/lib/api';

interface MenuDetailImageProps {
    slug: string;
}

export default function MenuDetailImage({ slug }: MenuDetailImageProps) {
    const { menu } = useMenuDetail(slug);
    const { images, isLoading: isDataLoading } = useMenuImages(menu?.id ?? 0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isImageReady, setIsImageReady] = useState(false);

    // 데이터 로딩 중일 때 표시
    if (isDataLoading) return <LoadingDitto message="이미지를 불러오는 중..." />;

    const rawMainImage = images.length > 0 ? images[selectedIndex].srcUrl : menu?.imageSrc;
    const mainImageSrc = getImageSrc(rawMainImage);

    return (
        <div className={styles.gallery}>
            {!isImageReady && <LoadingDitto message="이미지를 준비하고 있어요... 💜" />}
            <div className={`${styles.mainImageWrapper} ${!isImageReady ? styles.hidden : styles.fadeIn}`}>
                <Image
                    src={mainImageSrc}
                    alt={menu?.korName || '메뉴 이미지'}
                    fill
                    className={styles.mainImage}
                    priority
                    onLoad={() => setIsImageReady(true)}
                    onError={() => setIsImageReady(true)}
                />
                {menu?.isSoldOut && (
                    <div className={styles.soldOutOverlay}>품절 😢</div>
                )}
            </div>
            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            className={`${styles.thumbnail} ${selectedIndex === index ? styles.active : ''}`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <Image src={getImageSrc(img.srcUrl)} alt="추가 이미지" fill style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
