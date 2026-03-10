'use client';

import Image from "next/image";
import styles from "./SignatureMenu.module.css";

const SIGNATURE_MENUS = [
  {
    category: "✨ 시그니처",
    name: "말랑 퍼플 라떼",
    desc: "메타몽 컬러 그대로, 보라빛 한 잔",
    price: "₩7,000",
    image: "/upload/images/purple-latte.png",
    badge: "변신완료 🪄"
  },
  {
    category: "☕ 커피",
    name: "꾸덕 콜드브루",
    desc: "24시간 동안 천천히~ 메타몽처럼 느긋하게",
    price: "₩4,500",
    image: "/upload/images/cold-brew.png",
    badge: "NEW 🆕"
  },
  {
    category: "🍰 디저트",
    name: "겹겹이 초코 크로와상",
    desc: "메타몽이 겹겹이 접은 바삭 말랑 크로와상",
    price: "₩4,800",
    image: "/upload/images/chocolate-croissant.png"
  },
  {
    category: "🍵 음료",
    name: "초록 변신 말차",
    desc: "오늘은 초록색으로 변신! 녹차 향 가득",
    price: "₩6,500",
    image: "/upload/images/matcha-latte.png"
  }
];

export default function SignatureMenu() {
  return (
    <section id="menu" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>🪄</span>
          <span className={styles.sectionLabel}>변신 메뉴</span>
          <h2 className={styles.sectionTitle}>메타몽이 변신해서 만든 것들</h2>
          <p className={styles.sectionDesc}>
            오늘은 어떤 맛으로 변신했을까? 매일 조금씩 다른 메타몽의 손맛! 🫠
          </p>
        </div>

        <div className={styles.menuGrid}>
          {SIGNATURE_MENUS.map((menu, index) => (
            <div key={index} className={styles.menuCard}>
              <div className={styles.menuImageWrapper}>
                <Image
                  src={menu.image}
                  alt={menu.name}
                  fill
                  className={styles.menuImage}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                {menu.badge && <span className={styles.menuBadge}>{menu.badge}</span>}
              </div>
              <div className={styles.menuInfo}>
                <span className={styles.menuCategory}>{menu.category}</span>
                <h3 className={styles.menuName}>{menu.name}</h3>
                <p className={styles.menuDesc}>{menu.desc}</p>
                <span className={styles.menuPrice}>{menu.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
