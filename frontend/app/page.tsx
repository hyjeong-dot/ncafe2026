"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  ChevronDown,
  Check,
  MapPin,
  Phone,
  Instagram,
  Clock,
  Settings,
  Mail,
  Gift,
  Coffee,
  Cake,
  Smile,
  Camera,
  ShoppingBag,
  Users,
  Crown,
} from "lucide-react";

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({ hero: false, about: false });
  const isReady = imagesLoaded.hero && imagesLoaded.about;

  return (
    <div className={styles.page}>
      {!isReady && (
        <div className={styles.fullPageLoader}>
          <LoadingDitto message="변신 준비 중... 잠깐만 기다려줄래? 💜" size={320} />
        </div>
      )}
      <main className={isReady ? styles.fadeIn : styles.hidden}>
        {/* ========== Hero Section ========== */}
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
                  style={{ objectFit: 'cover', borderRadius: '3rem' }}
                  priority
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
                  onError={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
                />
              </div>
            </div>
          </div>

          <div className={styles.scrollHint}>
            <span>슬슬 구경해볼까?</span>
            <ChevronDown size={18} />
          </div>
        </section>

        {/* ========== About Section (Story) ========== */}
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
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, about: true }))}
                    onError={() => setImagesLoaded(prev => ({ ...prev, about: true }))}
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

        {/* ========== Signature Menu Section ========== */}
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
              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop"
                    alt="메타몽 시그니처 라떼"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className={styles.menuBadge}>변신완료 🪄</span>
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>✨ 시그니처</span>
                  <h3 className={styles.menuName}>말랑 퍼플 라떼</h3>
                  <p className={styles.menuDesc}>메타몽 컬러 그대로, 보라빛 한 잔</p>
                  <span className={styles.menuPrice}>₩7,000</span>
                </div>
              </div>

              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop"
                    alt="말랑 콜드브루"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className={styles.menuBadge}>NEW 🆕</span>
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>☕ 커피</span>
                  <h3 className={styles.menuName}>꾸덕 콜드브루</h3>
                  <p className={styles.menuDesc}>24시간 동안 천천히~ 메타몽처럼 느긋하게</p>
                  <span className={styles.menuPrice}>₩4,500</span>
                </div>
              </div>

              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop"
                    alt="푹신 초코 크로와상"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>🍰 디저트</span>
                  <h3 className={styles.menuName}>겹겹이 초코 크로와상</h3>
                  <p className={styles.menuDesc}>메타몽이 겹겹이 접은 바삭 말랑 크로와상</p>
                  <span className={styles.menuPrice}>₩4,800</span>
                </div>
              </div>

              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop"
                    alt="변신 말차 라떼"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>🍵 음료</span>
                  <h3 className={styles.menuName}>초록 변신 말차</h3>
                  <p className={styles.menuDesc}>오늘은 초록색으로 변신! 녹차 향 가득</p>
                  <span className={styles.menuPrice}>₩6,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Special Activities Section (6 cards like reference) ========== */}
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
              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Coffee size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>☕ 변신 음료 체험</h3>
                <p className={styles.specialCardText}>
                  메타몽이 그날 기분에 따라 다르게 만드는 깜짝 음료!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Cake size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🍮 말랑 디저트</h3>
                <p className={styles.specialCardText}>
                  메타몽처럼 말랑말랑한 식감의 수제 디저트 가득!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Camera size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>📸 변신 포토존</h3>
                <p className={styles.specialCardText}>
                  메타몽이 당신 모습으로 변신! 함께 찰칵~ 📷
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <ShoppingBag size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🛍️ 말랑 굿즈샵</h3>
                <p className={styles.specialCardText}>
                  메타몽 인형부터 머그컵까지, 데려가고 싶은 친구들!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Smile size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🛋️ 낮잠 허용석</h3>
                <p className={styles.specialCardText}>
                  메타몽이 자주 조는 자리… 뽀송한 쿠션에서 한숨 자도 돼요
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Crown size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🎁 단골 변신 카드</h3>
                <p className={styles.specialCardText}>
                  10잔 마시면 메타몽이 당신 취향으로 변신한 음료를 만들어줘요!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Testimonials ========== */}
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
              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;라떼에 제 얼굴이 그려져 나왔어요… 메타몽이 절 보고 변신한 건가?
                  너무 귀여워서 못 마시겠어요 ㅠㅠ 결국 마셨는데 맛도 최고 💜&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>🧑</div>
                  <div>
                    <div className={styles.authorName}>김서연</div>
                    <div className={styles.authorRole}>말랑해져서 돌아간 직장인</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;아이가 메타몽 쿠션에서 잠들었는데 메타몽이 이불 덮어줬어요(?).
                  디저트도 말랑말랑 맛있고, 우리 가족 단골 확정입니다 🥰&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>👨</div>
                  <div>
                    <div className={styles.authorName}>박지훈</div>
                    <div className={styles.authorRole}>온 가족이 말랑해진 아빠</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;메타몽이 제 텀블러로 변신해서 들고 나가도 되냐고 물었더니
                  진짜 변신해줬어요… 아, 그건 진짜 텀블러였나? 어쨌든 굿즈 최고 ✨&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>👩</div>
                  <div>
                    <div className={styles.authorName}>이하은</div>
                    <div className={styles.authorRole}>메타몽 덕후 카페 투어러</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA Section ========== */}
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
      </main>

    </div>
  );
}
