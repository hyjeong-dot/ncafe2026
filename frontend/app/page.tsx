"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import {
  Coffee,
  ArrowRight,
  Leaf,
  Clock,
  Settings,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Star,
  ChevronDown,
  Check,
  Heart,
  Sparkles,
  Zap,
  Search,
} from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ========== Header ========== */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link href="/" className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <Coffee size={22} />
            </div>
            <span>NCafe 2026</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="#menu" className={styles.navLink}>시그니처 메뉴</Link>
            <Link href="#story" className={styles.navLink}>브랜드 스토리</Link>
            <Link href="#reviews" className={styles.navLink}>고객 후기</Link>
            <Link href="#gallery" className={styles.navLink}>매장 소개</Link>
            <Link href="/admin" className={styles.adminButton}>
              <Settings size={16} />
              <span>관리자</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ========== Hero Section ========== */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Sparkles size={14} />
              2026 시즌 신메뉴 출시
            </div>
            <h1 className={styles.title}>
              커피 한 잔에 담긴
              <br />
              <span className={styles.titleHighlight}>특별한 이야기</span>
            </h1>
            <p className={styles.subtitle}>
              매일 아침 직접 로스팅한 스페셜티 원두로 빚어낸 깊은 풍미.
              <br />
              NCafe에서 당신만을 위한 완벽한 한 잔을 경험하세요.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/admin/menus" className={styles.primaryButton}>
                메뉴 보러가기 <ArrowRight size={20} />
              </Link>
              <Link href="#story" className={styles.secondaryButton}>
                우리의 이야기
              </Link>
            </div>
          </div>
          <div className={styles.scrollHint}>
            <span>Scroll</span>
            <ChevronDown size={18} />
          </div>
        </section>

        {/* ========== Stats ========== */}
        <section className={styles.stats}>
          <div className={`${styles.container} ${styles.statsGrid}`}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>150+</span>
              <span className={styles.statLabel}>전국 매장 수</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>12종</span>
              <span className={styles.statLabel}>직접 로스팅 원두</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>4.9</span>
              <span className={styles.statLabel}>고객 만족도</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>2026</span>
              <span className={styles.statLabel}>혁신의 시작</span>
            </div>
          </div>
        </section>

        {/* ========== Signature Menu ========== */}
        <section id="menu" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Signature Menu</span>
              <h2 className={styles.sectionTitle}>NCafe의 시그니처 메뉴</h2>
              <p className={styles.sectionDesc}>
                바리스타가 정성껏 준비한 시그니처 메뉴를 만나보세요.
                <br />
                매 시즌 새로운 맛으로 여러분을 찾아갑니다.
              </p>
            </div>
            <div className={styles.menuGrid}>
              {/* Menu Item 1 */}
              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop"
                    alt="시그니처 라떼"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className={styles.menuBadge}>BEST</span>
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>Coffee</span>
                  <h3 className={styles.menuName}>시그니처 라떼</h3>
                  <p className={styles.menuDesc}>부드러운 우유 거품 위에 카라멜 드리즐</p>
                  <span className={styles.menuPrice}>₩5,800</span>
                </div>
              </div>

              {/* Menu Item 2 */}
              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop"
                    alt="콜드브루"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className={styles.menuBadge}>NEW</span>
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>Coffee</span>
                  <h3 className={styles.menuName}>리저브 콜드브루</h3>
                  <p className={styles.menuDesc}>24시간 저온 추출, 깔끔한 뒷맛</p>
                  <span className={styles.menuPrice}>₩6,200</span>
                </div>
              </div>

              {/* Menu Item 3 */}
              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop"
                    alt="크루아상"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>Bakery</span>
                  <h3 className={styles.menuName}>버터 크루아상</h3>
                  <p className={styles.menuDesc}>프랑스산 버터로 72겹 수작업</p>
                  <span className={styles.menuPrice}>₩4,500</span>
                </div>
              </div>

              {/* Menu Item 4 */}
              <div className={styles.menuCard}>
                <div className={styles.menuImageWrapper}>
                  <Image
                    src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop"
                    alt="말차라떼"
                    fill
                    className={styles.menuImage}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuCategory}>Non-Coffee</span>
                  <h3 className={styles.menuName}>교토 말차 라떼</h3>
                  <p className={styles.menuDesc}>교토산 말차와 오트밀크의 조화</p>
                  <span className={styles.menuPrice}>₩6,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Brand Story ========== */}
        <section id="story" className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.storyLayout}>
              <div className={styles.storyImageWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                  alt="NCafe 로스팅 과정"
                  fill
                  className={styles.storyImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.storyImageOverlay}>
                  <span className={styles.storyOverlayText}>Since 2026 · Seoul, Korea</span>
                </div>
              </div>
              <div className={styles.storyContent}>
                <span className={styles.storyLabel}>Our Story</span>
                <h2 className={styles.storyTitle}>
                  한 잔의 커피에<br />
                  진심을 담습니다
                </h2>
                <p className={styles.storyText}>
                  NCafe는 &quot;기술과 커피의 만남&quot;이라는 비전 아래 2026년 서울에서 시작되었습니다.
                  우리는 산지 직거래로 최상급 스페셜티 원두를 수급하고, IoT 기반 스마트 브루잉
                  시스템을 통해 언제 어디서나 완벽한 한 잔을 제공합니다.
                </p>
                <div className={styles.storyFeatures}>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>산지 직거래 스페셜티 원두 100%</span>
                  </div>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>매일 소량 로스팅으로 최상의 신선도</span>
                  </div>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>친환경 패키징 100% 생분해 소재</span>
                  </div>
                  <div className={styles.storyFeature}>
                    <div className={styles.storyFeatureIcon}><Check size={14} /></div>
                    <span>IoT 스마트 브루잉 기술 도입</span>
                  </div>
                </div>
                <Link href="/about" className={styles.storyButton}>
                  자세히 보기 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Features / Why NCafe ========== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Why NCafe</span>
              <h2 className={styles.sectionTitle}>왜 NCafe인가요?</h2>
              <p className={styles.sectionDesc}>
                NCafe는 단순한 카페를 넘어 새로운 커피 경험을 제안합니다.
              </p>
            </div>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Coffee size={28} />
                </div>
                <h3 className={styles.cardTitle}>프리미엄 로스팅</h3>
                <p className={styles.cardText}>
                  세계 각지에서 엄선한 스페셜티 등급의 원두만을 사용합니다.
                  매일 아침 직접 로스팅하여 원두 본연의 향을 극대화합니다.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Leaf size={28} />
                </div>
                <h3 className={styles.cardTitle}>지속 가능한 가치</h3>
                <p className={styles.cardText}>
                  100% 생분해성 컵과 공정 무역 원두 수입을 통해
                  환경과 농가 모두에게 긍정적인 영향을 만들어갑니다.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Zap size={28} />
                </div>
                <h3 className={styles.cardTitle}>스마트 브루잉</h3>
                <p className={styles.cardText}>
                  최첨단 IoT 기반 브루잉 시스템으로 온도, 압력, 추출 시간을
                  정밀 제어하여 완벽한 맛을 보장합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Testimonials ========== */}
        <section id="reviews" className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Reviews</span>
              <h2 className={styles.sectionTitle}>고객들의 이야기</h2>
              <p className={styles.sectionDesc}>
                NCafe를 경험한 분들의 진솔한 후기를 만나보세요.
              </p>
            </div>
            <div className={styles.testimonialGrid}>
              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;매일 출근 전에 들리는데, 라떼 맛이 항상 한결같아요. 바리스타분들도 너무 친절하시고, 공간도 아늑해서 제 단골 카페입니다.&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>김</div>
                  <div>
                    <div className={styles.authorName}>김서연</div>
                    <div className={styles.authorRole}>직장인 · 강남점 단골</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;콜드브루가 정말 깔끔합니다. 잡맛 없이 원두 본연의 맛이 살아있어요. 원두도 직접 구매해서 집에서 즐기고 있습니다.&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>박</div>
                  <div>
                    <div className={styles.authorName}>박지훈</div>
                    <div className={styles.authorRole}>프리랜서 · 홈카페 마니아</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;디저트와 커피 페어링이 너무 좋아요! 크루아상은 파리에서 먹던 것과 비교해도 손색없습니다. 분위기도 최고!&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>이</div>
                  <div>
                    <div className={styles.authorName}>이하은</div>
                    <div className={styles.authorRole}>대학생 · 카페 투어러</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Gallery ========== */}
        <section id="gallery" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Our Space</span>
              <h2 className={styles.sectionTitle}>NCafe의 공간</h2>
              <p className={styles.sectionDesc}>
                따뜻한 조명과 모던한 인테리어가 어우러진 NCafe의 공간을 소개합니다.
              </p>
            </div>
            <div className={styles.galleryGrid}>
              <div className={styles.galleryItem}>
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop"
                  alt="카페 인테리어"
                  fill
                  className={styles.galleryImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.galleryOverlay}>
                  <Search size={28} className={styles.galleryIcon} />
                </div>
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=600&auto=format&fit=crop"
                  alt="에스프레소 추출"
                  fill
                  className={styles.galleryImage}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.galleryOverlay}>
                  <Search size={28} className={styles.galleryIcon} />
                </div>
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=600&auto=format&fit=crop"
                  alt="커피와 디저트"
                  fill
                  className={styles.galleryImage}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.galleryOverlay}>
                  <Search size={28} className={styles.galleryIcon} />
                </div>
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=600&auto=format&fit=crop"
                  alt="원두 로스팅"
                  fill
                  className={styles.galleryImage}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.galleryOverlay}>
                  <Search size={28} className={styles.galleryIcon} />
                </div>
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop"
                  alt="라떼아트"
                  fill
                  className={styles.galleryImage}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.galleryOverlay}>
                  <Search size={28} className={styles.galleryIcon} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA Section ========== */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              NCafe 멤버십에 가입하고
              <br />
              특별한 혜택을 받아보세요
            </h2>
            <p className={styles.ctaDesc}>
              멤버십 가입 시 첫 음료 무료 쿠폰 증정!
              <br />
              매월 한정 원두 구독 서비스와 다양한 혜택을 누려보세요.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/signup" className={styles.ctaPrimary}>
                무료로 가입하기
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
                <Coffee size={22} />
                <span>NCafe 2026</span>
              </div>
              <p className={styles.footerDesc}>
                커피와 기술의 조화로 새로운 일상을 만듭니다.
                <br />
                당신의 하루에 특별한 한 잔을 더합니다.
              </p>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon} aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className={styles.footerTitle}>바로가기</h4>
              <nav className={styles.footerLinks}>
                <Link href="/admin/menus" className={styles.footerLink}>메뉴 관리</Link>
                <Link href="/admin/categories" className={styles.footerLink}>카테고리 관리</Link>
                <Link href="/admin" className={styles.footerLink}>관리자 대시보드</Link>
                <Link href="/about" className={styles.footerLink}>공지사항</Link>
              </nav>
            </div>

            <div>
              <h4 className={styles.footerTitle}>고객지원</h4>
              <nav className={styles.footerLinks}>
                <Link href="/faq" className={styles.footerLink}>자주 묻는 질문</Link>
                <Link href="/privacy" className={styles.footerLink}>개인정보처리방침</Link>
                <Link href="/terms" className={styles.footerLink}>이용약관</Link>
                <Link href="/careers" className={styles.footerLink}>채용안내</Link>
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
                <span>contact@ncafe2026.com</span>
              </div>
              <div className={styles.contactItem}>
                <Clock size={16} />
                <span>매일 07:00 - 22:00</span>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2026 NCafe Corp. All rights reserved.</p>
            <p>Crafted with <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> for coffee lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
