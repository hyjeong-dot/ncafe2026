'use client';

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  onImageLoad: () => void;
}

export default function HeroSection({ onImageLoad }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      {/* Floating decorations */}
      <div className={styles.floatingDeco}>
        <span className={styles.floatItem} style={{ top: '8%', left: '6%', animationDelay: '0s' }}>🫠</span>
        <span className={styles.floatItem} style={{ top: '15%', right: '10%', animationDelay: '1s' }}>💜</span>
        <span className={styles.floatItem} style={{ bottom: '25%', left: '8%', animationDelay: '2s' }}>☕</span>
        <span className={styles.floatItem} style={{ top: '30%', right: '5%', animationDelay: '0.5s' }}>🫧</span>
        <span className={styles.floatItem} style={{ bottom: '15%', right: '15%', animationDelay: '1.5s' }}>🪄</span>
        <span className={styles.floatItem} style={{ top: '50%', left: '3%', animationDelay: '2.5s' }}>🍮</span>
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            오늘도 변신 완료! 바리스타 모드 ON 🪄
          </div>
          <h1 className={styles.title}>
            말랑말랑~ 한 모금에
            <br />
            <span className={styles.titleHighlight}>변신</span>하는 맛 ☕
          </h1>
          <p className={styles.subtitle}>
            무엇이든 될 수 있는 메타몽이 오늘은 바리스타로 변신!
            <br />
            말랑한 손으로 내리는 커피, 한번 맛보실래요? 🫠💜
          </p>
          <div className={styles.buttonGroup}>
            <Link href="#about" className={styles.primaryButton}>
              메타몽 이야기 보기 🫠
            </Link>
            <Link href="/menus" className={styles.secondaryButton}>
              오늘의 변신 메뉴 <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className={styles.heroImage}>
          <div className={styles.dittoCharacter}>
            <Image
              src="/images/ditto/ditto-barista.png"
              alt="메타몽 바리스타"
              width={480}
              height={480}
              className={styles.image}
              priority
              onLoad={onImageLoad}
              onError={onImageLoad}
            />
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>슬슬 구경해볼까?</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
