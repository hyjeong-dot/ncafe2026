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
          지금 가입하면 1,000원 할인 쿠폰을 바로 드려요! 🎫
          음료 10잔 적립하면 아메리카노도 무료! ☕
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
