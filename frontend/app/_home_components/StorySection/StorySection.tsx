'use client';

import Image from "next/image";
import { Check } from "lucide-react";
import styles from "./StorySection.module.css";

interface StorySectionProps {
  onImageLoad: () => void;
}

export default function StorySection({ onImageLoad }: StorySectionProps) {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.storyLayout}>
          <div className={styles.storyImageArea}>
            <div className={styles.storyImageWrapper}>
              <Image
                src="/images/ditto/ditto-cafe-interior.png"
                alt="메타몽 카페 내부"
                fill
                className={styles.storyImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
                onLoad={onImageLoad}
                onError={onImageLoad}
              />
            </div>
          </div>
          <div className={styles.storyContent}>
            <span className={styles.storyLabel}>🫠 우리가 누구냐면요</span>
            <h2 className={styles.storyTitle}>
              "뭐든 될 수 있지만,
              <br />오늘은 바리스타!"
            </h2>
            <p className={styles.storyText}>
              아무거나 변신할 수 있는 메타몽이 가장 좋아하는 변신은
              바로 바리스타! 🪄 말랑한 몸으로 원두를 고르고,
              동글동글한 손으로 라떼아트까지 척척 해낸답니다.
            </p>
            <div className={styles.storyFeatures}>
              <div className={styles.storyFeature}>
                <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                <span>변신해서 직접 원두 농장까지 다녀온 원두만 사용해요 ☕</span>
              </div>
              <div className={styles.storyFeature}>
                <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                <span>디저트도 메타몽이 직접 반죽해요 (말랑말랑 전문가) 🍮</span>
              </div>
              <div className={styles.storyFeature}>
                <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                <span>가끔 손님 닮은 라떼아트를 실수로 만들 수 있어요 🫠</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
