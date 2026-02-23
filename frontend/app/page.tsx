"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
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
  return (
    <div className={styles.page}>
      {/* ========== Header ========== */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link href="/" className={styles.logoArea}>
            <span className={styles.logoEmoji}>💜</span>
            <span>메타몽 카페</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="#about" className={styles.navLink}>카페 소개</Link>
            <Link href="#menu" className={styles.navLink}>특별 메뉴</Link>
            <Link href="#special" className={styles.navLink}>즐길거리</Link>
            <Link href="#reviews" className={styles.navLink}>고객 후기</Link>
            <Link href="/menus" className={styles.navLink}>전체 메뉴</Link>
            <Link href="/admin" className={styles.adminButton}>
              <Settings size={14} />
              <span>관리자</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ========== Hero Section ========== */}
        <section className={styles.hero}>
          {/* Floating decorations */}
          <div className={styles.floatingDeco}>
            <span className={styles.floatItem} style={{ top: '8%', left: '6%', animationDelay: '0s' }}>✨</span>
            <span className={styles.floatItem} style={{ top: '15%', right: '10%', animationDelay: '1s' }}>💜</span>
            <span className={styles.floatItem} style={{ bottom: '25%', left: '8%', animationDelay: '2s' }}>☕</span>
            <span className={styles.floatItem} style={{ top: '30%', right: '5%', animationDelay: '0.5s' }}>🍰</span>
            <span className={styles.floatItem} style={{ bottom: '15%', right: '15%', animationDelay: '1.5s' }}>⭐</span>
            <span className={styles.floatItem} style={{ top: '50%', left: '3%', animationDelay: '2.5s' }}>🧁</span>
          </div>

          <div className={styles.heroContent}>
            {/* Ditto Barista Image */}
            <div className={styles.dittoCharacter}>
              <div className={styles.dittoGlow}></div>
              <Image
                src="/images/ditto/ditto-barista.png"
                alt="메타몽 바리스타"
                width={300}
                height={300}
                style={{ objectFit: 'contain' }}
                priority
              />
              <span className={styles.dittoOrbit} style={{ animationDelay: '0s' }}>☕</span>
              <span className={styles.dittoOrbit} style={{ animationDelay: '1.3s' }}>🍰</span>
              <span className={styles.dittoOrbit} style={{ animationDelay: '2.6s' }}>💜</span>
            </div>

            <div className={styles.badge}>
              <Sparkles size={14} />
              메타몽이 직접 서빙하는 카페 ☕
            </div>
            <h1 className={styles.title}>
              메타몽이 서빙해주는
              <br />
              <span className={styles.titleHighlight}>카페</span> ☕
            </h1>
            <p className={styles.subtitle}>
              세상에서 가장 귀여운 바리스타 메타몽이 만들어주는
              <br />
              스페셜티 커피와 수제 디저트를 만나보세요! 💜
            </p>
            <div className={styles.buttonGroup}>
              <Link href="#about" className={styles.primaryButton}>
                카페 소개 보기 🍰
              </Link>
              <Link href="/menus" className={styles.secondaryButton}>
                메뉴 구경하기 <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.scrollHint}>
            <span>아래로 스크롤</span>
            <ChevronDown size={18} />
          </div>
        </section>

        {/* ========== About Section (Story) ========== */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.container}>
            <div className={styles.storyLayout}>
              <div className={styles.storyImageArea}>
                <div className={styles.storyDecoTop}>✨ 메타몽 카페에 오신 걸 환영해요! ✨</div>
                <div className={styles.storyImageWrapper}>
                  <Image
                    src="/images/ditto/ditto-cafe-interior.png"
                    alt="메타몽 카페 내부"
                    fill
                    className={styles.storyImage}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.storyDecoBottom}>
                  <span>💜</span>
                  <span>☕</span>
                  <span>🍰</span>
                  <span>🎀</span>
                </div>
              </div>
              <div className={styles.storyContent}>
                <span className={styles.storyLabel}>🏠 카페 소개</span>
                <h2 className={styles.storyTitle}>
                  메타몽과 함께하는
                  <br />특별한 카페 시간
                </h2>
                <p className={styles.storyText}>
                  말랑말랑한 메타몽이 정성껏 커피를 내려주는 카페! 🎀
                  최고급 스페셜티 원두와 정성 가득한 수제 디저트로
                  여러분의 하루를 더 달콤하게 만들어 드려요.
                </p>
                <div className={styles.storyFeatures}>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>메타몽이 엄선한 최상급 원두만 사용해요 ☕</span>
                  </div>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>매일 아침 직접 만드는 신선한 디저트! 🍰</span>
                  </div>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>세상에서 가장 귀여운 바리스타가 서빙해줘요 💜</span>
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
              <span className={styles.sectionEmoji}>☕</span>
              <span className={styles.sectionLabel}>특별 메뉴</span>
              <h2 className={styles.sectionTitle}>메타몽이 추천하는 인기 메뉴</h2>
              <p className={styles.sectionDesc}>
                메타몽 바리스타가 정성껏 준비한 시그니처 메뉴를 만나보세요! 💜
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
                  <span className={styles.menuBadge}>BEST 💜</span>
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>✨ 시그니처</span>
                  <h3 className={styles.menuName}>메타몽 시그니처 라떼</h3>
                  <p className={styles.menuDesc}>보라빛 토핑이 올라간 특별한 라떼</p>
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
                  <h3 className={styles.menuName}>말랑 콜드브루</h3>
                  <p className={styles.menuDesc}>24시간 저온 추출, 깔끔한 뒷맛</p>
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
                  <h3 className={styles.menuName}>푹신 초코 크로와상</h3>
                  <p className={styles.menuDesc}>결이 살아있는 크로와상 속 진한 초콜릿</p>
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
                  <h3 className={styles.menuName}>변신 말차 라떼</h3>
                  <p className={styles.menuDesc}>교토산 말차와 오트밀크의 환상 조화</p>
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
              <span className={styles.sectionEmoji}>🎉</span>
              <span className={styles.sectionLabel}>즐길거리</span>
              <h2 className={styles.sectionTitle}>메타몽 카페에서만 할 수 있는 것들</h2>
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
                <h3 className={styles.specialCardTitle}>☕ 시그니처 음료</h3>
                <p className={styles.specialCardText}>
                  메타몽 라떼, 변신 에이드 등 포켓몬 테마 음료를 즐겨보세요!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Cake size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🧁 귀여운 디저트</h3>
                <p className={styles.specialCardText}>
                  몬스터볼 마카롱, 메타몽 케이크 등 귀여운 수제 디저트!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Camera size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>📸 포토존</h3>
                <p className={styles.specialCardText}>
                  메타몽과 함께 찍는 인생샷! SNS에 자랑해보세요 💜
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <ShoppingBag size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🛍️ 포켓몬 굿즈</h3>
                <p className={styles.specialCardText}>
                  한정판 포켓몬 굿즈와 콜라보 상품을 만나보세요!
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Smile size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🛋️ 아늑한 공간</h3>
                <p className={styles.specialCardText}>
                  보라빛 쿠션이 가득한 편안한 카페에서 힐링 시간을 보내세요
                </p>
              </div>

              <div className={styles.specialCard}>
                <div className={styles.specialIconWrap}>
                  <Crown size={28} />
                </div>
                <h3 className={styles.specialCardTitle}>🎁 멤버십 혜택</h3>
                <p className={styles.specialCardText}>
                  단골 트레이너에게는 특별한 할인과 시즌 한정 메뉴를 제공!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Testimonials ========== */}
        <section id="reviews" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEmoji}>⭐</span>
              <span className={styles.sectionLabel}>고객 후기</span>
              <h2 className={styles.sectionTitle}>방문객들의 이야기</h2>
              <p className={styles.sectionDesc}>
                메타몽 카페를 경험한 분들의 생생한 후기예요! 💬
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
                  &quot;메타몽 모양 라떼아트가 너무 귀여워서 사진 찍느라 정신없었어요!
                  맛도 분위기도 최고, 매일 오고 싶은 카페입니다 💜&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>🧑</div>
                  <div>
                    <div className={styles.authorName}>김서연</div>
                    <div className={styles.authorRole}>직장인 · 단골 고객</div>
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
                  &quot;아이가 메타몽을 너무 좋아해서 왔는데, 저도 반해버렸어요.
                  디저트가 진짜 맛있고 분위기가 너무 아늑해요! 🥰&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>👨</div>
                  <div>
                    <div className={styles.authorName}>박지훈</div>
                    <div className={styles.authorRole}>가족 방문 고객</div>
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
                  &quot;인스타에서 보고 일부러 찾아왔는데, 실물이 더 예뻐요!
                  메타몽 굿즈도 사고, 완전 힐링 그 자체였어요 ✨&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>👩</div>
                  <div>
                    <div className={styles.authorName}>이하은</div>
                    <div className={styles.authorRole}>대학생 · 카페 투어러</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA Section ========== */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <span className={styles.ctaEmoji}>💜</span>
            <h2 className={styles.ctaTitle}>
              메타몽 카페 멤버십에 가입하고
              <br />
              특별한 혜택을 받아보세요!
            </h2>
            <p className={styles.ctaDesc}>
              멤버십 가입 시 첫 음료 무료 쿠폰과 함께
              메타몽 미니 피규어를 선물로 드려요! 🎁
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/menus" className={styles.ctaPrimary}>
                전체 메뉴 보기
              </Link>
              <Link href="/admin" className={styles.ctaSecondary}>
                관리자 페이지
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========== Footer ========== */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerLogo}>
                <span>💜</span>
                <span>메타몽 카페</span>
              </div>
              <p className={styles.footerDesc}>
                세상에서 가장 귀여운 포켓몬 카페 💜
                <br />
                말랑말랑한 행복을 선물합니다.
              </p>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon} aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Gift">
                  <Gift size={18} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Heart">
                  <Heart size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className={styles.footerTitle}>메타몽 카페</h4>
              <nav className={styles.footerLinks}>
                <Link href="#about" className={styles.footerLink}>카페 소개</Link>
                <Link href="/menus" className={styles.footerLink}>메뉴</Link>
                <Link href="#special" className={styles.footerLink}>즐길거리</Link>
              </nav>
            </div>

            <div>
              <h4 className={styles.footerTitle}>고객 지원</h4>
              <nav className={styles.footerLinks}>
                <Link href="#" className={styles.footerLink}>자주 묻는 질문</Link>
                <Link href="#" className={styles.footerLink}>예약 문의</Link>
                <Link href="#" className={styles.footerLink}>이벤트</Link>
              </nav>
            </div>

            <div>
              <h4 className={styles.footerTitle}>연락처</h4>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>02-1234-5678</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>hello@dittocafe.kr</span>
              </div>
              <div className={styles.contactItem}>
                <Clock size={16} />
                <span>매일 09:00 - 22:00</span>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2026 메타몽 카페. All rights reserved. 💜</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
