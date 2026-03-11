'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuChatCard.module.css';

interface MenuData {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

const MENU_DATA: Record<number, MenuData> = {
  1: {
    id: 1,
    name: '말랑 퍼플 라떼',
    price: '₩7,000',
    image: '/upload/images/purple-latte.png',
    description: '메타몽 시그니처! 보라빛 말랑한 라떼몽 💜',
  },
  2: {
    id: 2,
    name: '꾸덕 콜드브루',
    price: '₩4,500',
    image: '/upload/images/cold-brew.png',
    description: '메타몽처럼 느긋하게 내린 꾸덕한 커피 ☕',
  },
  3: {
    id: 3,
    name: '겹겹이 초코 크로와상',
    price: '₩4,800',
    image: '/upload/images/chocolate-croissant.png',
    description: '바삭하고 달콤한 메타몽의 간식 🍰',
  },
  4: {
    id: 4,
    name: '초록 변신 말차',
    price: '₩6,500',
    image: '/upload/images/matcha-latte.png',
    description: '싱그러운 초록색으로 변신한 말차 라떼몽 🍵',
  },
};

export default function MenuChatCard({ id }: { id: number }) {
  const menu = MENU_DATA[id];

  if (!menu) return null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={menu.image}
          alt={menu.name}
          fill
          className={styles.image}
          sizes="200px"
        />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{menu.name}</h4>
        <p className={styles.price}>{menu.price}</p>
        <p className={styles.desc}>{menu.description}</p>
        <Link href={`/menus/${menu.id}`} className={styles.link}>
          상세보기
        </Link>
      </div>
    </div>
  );
}
