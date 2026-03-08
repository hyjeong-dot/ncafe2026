'use client';

import { Star } from "lucide-react";
import styles from "./ReviewSection.module.css";

const REVIEWS = [
  {
    text: '"라떼에 제 얼굴이 그려져 나왔어요… 메타몽이 절 보고 변신한 건가? 너무 귀여워서 못 마시겠어요 ㅠㅠ 결국 마셨는데 맛도 최고 💜"',
    author: "김서연",
    role: "말랑해져서 돌아간 직장인",
    avatar: "🧑"
  },
  {
    text: '"아이가 메타몽 쿠션에서 잠들었는데 메타몽이 이불 덮어줬어요(?). 디저트도 말랑말랑 맛있고, 우리 가족 단골 확정입니다 🥰"',
    author: "박지훈",
    role: "온 가족이 말랑해진 아빠",
    avatar: "👨"
  },
  {
    text: '"메타몽이 제 텀블러로 변신해서 들고 나가도 되냐고 물었더니 진짜 변신해줬어요… 아, 그건 진짜 텀블러였나? 어쨌든 굿즈 최고 ✨"',
    author: "이하은",
    role: "메타몽 덕후 카페 투어러",
    avatar: "👩"
  }
];

export default function ReviewSection() {
  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>💬</span>
          <span className={styles.sectionLabel}>변신 후기</span>
          <h2 className={styles.sectionTitle}>메타몽을 만나고 온 사람들</h2>
          <p className={styles.sectionDesc}>
            한번 오면 말랑해져서 돌아가는 곳, 그게 바로 여기예요 🫠
          </p>
        </div>

        <div className={styles.testimonialGrid}>
          {REVIEWS.map((review, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" strokeWidth={0} />
                ))}
              </div>
              <p className={styles.testimonialText}>{review.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>{review.avatar}</div>
                <div>
                  <div className={styles.authorName}>{review.author}</div>
                  <div className={styles.authorRole}>{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
