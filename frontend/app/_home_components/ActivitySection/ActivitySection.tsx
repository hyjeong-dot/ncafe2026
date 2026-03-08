'use client';

import Image from "next/image";
import { Coffee, Cake, Camera, ShoppingBag, Smile, Crown } from "lucide-react";
import styles from "./ActivitySection.module.css";

const ACTIVITIES = [
  {
    icon: <Coffee size={28} />,
    title: "☕ 변신 음료 체험",
    text: "메타몽이 그날 기분에 따라 다르게 만드는 깜짝 음료!"
  },
  {
    icon: <Cake size={28} />,
    title: "🍮 말랑 디저트",
    text: "메타몽처럼 말랑말랑한 식감의 수제 디저트 가득!"
  },
  {
    icon: <Camera size={28} />,
    title: "📸 변신 포토존",
    text: "메타몽이 당신 모습으로 변신! 함께 찰칵~ 📷"
  },
  {
    icon: <ShoppingBag size={28} />,
    title: "🛍️ 말랑 굿즈샵",
    text: "메타몽 인형부터 머그컵까지, 데려가고 싶은 친구들!"
  },
  {
    icon: <Smile size={28} />,
    title: " Couch 낮잠 허용석",
    text: "메타몽이 자주 조는 자리… 뽀송한 쿠션에서 한숨 자도 돼요"
  },
  {
    icon: <Crown size={28} />,
    title: "🎁 단골 변신 카드",
    text: "10잔 마시면 메타몽이 당신 취향으로 변신한 음료를 만들어줘요!"
  }
];

export default function ActivitySection() {
  return (
    <section id="special" className={styles.specialSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>🫧</span>
          <span className={styles.sectionLabel}>변신 체험</span>
          <h2 className={styles.sectionTitle}>메타몽이랑 놀면 이런 게 가능해요</h2>
        </div>

        {/* Activities Banner Image */}
        <div className={styles.activitiesBanner}>
          <Image
            src="/images/ditto/ditto-activities.png"
            alt="메타몽 카페 활동들"
            width={700}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className={styles.specialGrid}>
          {ACTIVITIES.map((activity, index) => (
            <div key={index} className={styles.specialCard}>
              <div className={styles.specialIconWrap}>
                {activity.icon}
              </div>
              <h3 className={styles.specialCardTitle}>{activity.title}</h3>
              <p className={styles.specialCardText}>{activity.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
