'use client';

import Link from "next/link";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <span className={styles.ctaEmoji}>🫠</span>
        <h2 className={styles.ctaTitle}>
          메타몽이 당신을 기다리고 있어요
          <br />
          (지금 슬슬 졸리대요… 빨리 와주세요!)
        </h2>
        <p className={styles.ctaDesc}>
          첫 방문 시 메타몽이 직접 골라주는 오늘의 추천 음료 한 잔 무료!
          그리고 말랑 미니 피규어도 챙겨 가세요 🎁
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/menus" className={styles.ctaPrimary}>
            변신 메뉴 구경하기
          </Link>
          <Link href="/admin" className={styles.ctaSecondary}>
            사장님 전용 입구
          </Link>
        </div>
      </div>
    </section>
  );
}
