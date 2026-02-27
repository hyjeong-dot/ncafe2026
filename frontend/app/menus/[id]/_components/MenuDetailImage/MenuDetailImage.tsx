'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './MenuDetailImage.module.css';
import { useMenuImages } from './useMenuImages';
import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';

interface MenuDetailImageProps {
    menuId: number;
}

export default function MenuDetailImage({ menuId }: MenuDetailImageProps) {
    const { menu } = useMenuDetail(menuId);
    const { images, isLoading: isDataLoading } = useMenuImages(menuId);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isImageReady, setIsImageReady] = useState(false);

    // 데이터 로딩 중일 때 표시
    if (isDataLoading) return <LoadingDitto message="이미지를 불러오는 중..." />;

    const mainImage = images.length > 0 ? images[selectedIndex].srcUrl : (menu?.imageSrc || '/images/blank.png');

    return (
        <div className={styles.gallery}>
            {!isImageReady && <LoadingDitto message="이미지를 준비하고 있어요... 💜" />}
            <div className={`${styles.mainImageWrapper} ${!isImageReady ? styles.hidden : styles.fadeIn}`}>
                <Image
                    src={mainImage && mainImage !== 'blank.png' ? mainImage : '/images/blank.png'}
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
                            <Image src={img.srcUrl} alt="추가 이미지" fill style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
