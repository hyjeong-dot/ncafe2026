"use client";

import { useState } from "react";
import styles from "./page.module.css";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";

// Home Components
import HeroSection from "./_home_components/HeroSection/HeroSection";
import StorySection from "./_home_components/StorySection/StorySection";
import SignatureMenu from "./_home_components/SignatureMenu/SignatureMenu";
import ActivitySection from "./_home_components/ActivitySection/ActivitySection";
import ReviewSection from "./_home_components/ReviewSection/ReviewSection";
import CTASection from "./_home_components/CTASection/CTASection";

/**
 * 메타몽 카페 메인 페이지
 * 각 섹션은 _home_components로 분리되어 관리됩니다.
 */
export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({ hero: false, about: false });
  const isReady = imagesLoaded.hero && imagesLoaded.about;

  return (
    <div className={styles.page}>
      {/* 이미지 로딩 전까지 노출되는 풀페이지 로더 */}
      {!isReady && (
        <div className={styles.fullPageLoader}>
          <LoadingDitto message="변신 준비 중... 잠깐만 기다려줄래? 💜" size={320} />
        </div>
      )}

      {/* 로딩 완료 후 페이드 인 효과로 노출 */}
      <main className={isReady ? styles.fadeIn : styles.hidden}>
        {/* 1. 히어로 섹션 */}
        <HeroSection onImageLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))} />

        {/* 2. 브랜드 스토리 (About) 섹션 */}
        <StorySection onImageLoad={() => setImagesLoaded(prev => ({ ...prev, about: true }))} />

        {/* 3. 시그니처 메뉴 섹션 */}
        <SignatureMenu />

        {/* 4. 변신 체험 섹션 */}
        <ActivitySection />

        {/* 5. 변신 후기 (Reviews) 섹션 */}
        <ReviewSection />

        {/* 6. 하단 CTA 섹션 */}
        <CTASection />
      </main>
    </div>
  );
}
