'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuChatCard.module.css';

interface MenuDetail {
  id: number;
  slug: string;
  korName: string;
  engName: string;
  description: string;
  price: number;
  imageSrc: string;
  isSoldOut: boolean;
}

export default function MenuChatCard({ id }: { id: number }) {
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menus/${id}`);
        if (!response.ok) throw new Error('Menu fetch failed');
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        console.error('Failed to fetch menu info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMenu();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingSkeleton}>이삿짐 나르는 중... 꼬물꼬물 📦</div>
      </div>
    );
  }

  if (!menu) return null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={menu.imageSrc || '/images/ditto/blank.png'}
          alt={menu.korName}
          fill
          className={styles.image}
          sizes="250px"
        />
        {menu.isSoldOut && <span className={styles.soldOutBadge}>품절몽 🫠</span>}
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{menu.korName}</h4>
        <p className={styles.price}>₩{menu.price.toLocaleString()}</p>
        <p className={styles.desc}>{menu.description}</p>
        <Link href={`/menus/${menu.slug}`} className={styles.link}>
          상세보기
        </Link>
      </div>
    </div>
  );
}
