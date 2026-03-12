package com.new_cafe.app.backend.global.config;

import com.new_cafe.app.backend.admin.category.adapter.out.persistence.AdminCategoryJpaRepository;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.AdminMenuImageJpaRepository;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.AdminMenuJpaRepository;
import com.new_cafe.app.backend.member.adapter.out.persistence.MemberJpaRepository;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

        private final AdminCategoryJpaRepository categoryRepository;
        private final AdminMenuJpaRepository menuRepository;
        private final AdminMenuImageJpaRepository menuImageRepository;
        private final MemberJpaRepository memberRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                // 0. 관리자 계정 생성 // 데이터가 하나도 없을 때만 실행됩니다.
                if (memberRepository.count() == 0) {
                        // 관리자 계정
                        memberRepository.save(Member.builder()
                                        .username("admin")
                                        .nickname("관리자")
                                        .password(passwordEncoder.encode("1234"))
                                        .email("admin@ncafe.com")
                                        .phoneNumber("010-0000-0000")
                                        .role("ROLE_ADMIN")
                                        .build());

                        // 테스트 유저 (heo)
                        memberRepository.save(Member.builder()
                                        .username("heo")
                                        .nickname("둥이")
                                        .password(passwordEncoder.encode("1234"))
                                        .email("heo@ncafe.com")
                                        .phoneNumber("010-1234-5678")
                                        .role("ROLE_USER")
                                        .build());
                }

                // 1. 카테고리 데이터 생성 (ID는 자동 발급됨)
                AdminCategory signature = findOrCreateCategory("Signature", "✨", 1);
                AdminCategory coffee = findOrCreateCategory("Coffee", "☕", 2);
                AdminCategory sandwich = findOrCreateCategory("Sandwich & Bagel", "🥪", 3);
                AdminCategory dessert = findOrCreateCategory("Dessert", "🍰", 4);

                // 2. 메뉴 및 이미지 데이터 생성
                saveMenu("말랑 퍼플 라떼", "Malrang Purple Latte", "보랏빛 마법 가루가 들어간 메타몽 카페의 시그니처 라떼", 7000, signature.getId(),
                                1,
                                "/upload/images/purple-latte.png");
                saveMenu("초록 변신 말차", "Green Transformation Matcha", "진한 말차와 부드러운 우유가 만나 초록빛으로 변신!", 6500,
                                signature.getId(), 2,
                                "/upload/images/matcha-latte.png");
                saveMenu("바나나 크림 라떼", "Banana Cream Latte", "달콤한 바나나 크림이 올라간 부드러운 라떼", 6500, signature.getId(), 3,
                                "/upload/images/bananalatte.png");

                saveMenu("꾸덕 콜드브루", "Ggudeok Cold Brew", "진하고 깊은 풍미의 콜드브루 위에 꾸덕한 크림이 가득", 4500, coffee.getId(), 1,
                                "/upload/images/cold-brew.png");
                saveMenu("아메리카노", "Americano", "깊고 진한 풍미의 프리미엄 아메리카노", 4500, coffee.getId(), 2,
                                "/upload/images/americano.png");
                saveMenu("카페 라떼", "Cafe Latte", "에스프레소와 우유의 고소한 조화", 5000, coffee.getId(), 3,
                                "/upload/images/cafelatte.png");
                saveMenu("카푸치노", "Cappuccino", "부드러운 우유 거품과 시나몬의 향긋함", 5500, coffee.getId(), 4,
                                "/upload/images/capuchino.png");
                saveMenu("카라멜 마끼아또", "Caramel Macchiato", "달콤한 카라멜 시럽과 부드러운 거품", 5800, coffee.getId(), 5,
                                "/upload/images/caramel-macchiato.png");
                saveMenu("에스프레소", "Espresso", "이탈리안 정통 스타일의 진한 에스프레소", 4000, coffee.getId(), 6,
                                "/upload/images/espresso.png");

                saveMenu("햄 치즈 샌드위치", "Ham & Cheese Sandwich", "신선한 야채와 고소한 햄, 치즈의 만남", 7500, sandwich.getId(), 1,
                                "/upload/images/ham-cheese-sandwich.png", "/upload/images/ham-cheese-sandwich1.png");
                saveMenu("에그 스크램블 샌드위치", "Scrambled Egg Sandwich", "부드러운 에그 스크램블이 가득한 영양 만점 샌드위치", 7800,
                                sandwich.getId(), 2,
                                "/upload/images/scrambled-egg-sandwich.png",
                                "/upload/images/scrambled-egg-sandwich1.png");
                saveMenu("참치 샌드위치", "Tuna Sandwich", "담백한 참치 마요네즈와 신선한 야채", 7500, sandwich.getId(), 3,
                                "/upload/images/tuna-sandwich.png", "/upload/images/tuna-sandwich1.png");
                saveMenu("터키 샌드위치", "Turkey Sandwich", "저칼로리 터키 햄으로 건강하게 즐기는 샌드위치", 8000, sandwich.getId(), 4,
                                "/upload/images/turkey-sandwich.png", "/upload/images/turkey-sandwich1.png");
                saveMenu("비프 베이글", "Beef Bagel", "육즙 가득한 소고기와 쫄깃한 베이글", 8500, sandwich.getId(), 5,
                                "/upload/images/beef-bagel.png", "/upload/images/beef-bagel1.png");
                saveMenu("크림 치즈 베이글", "Bagel with Cream Cheese", "꾸덕한 크림 치즈를 듬뿍 바른 클래식 베이글", 5500, sandwich.getId(), 6,
                                "/upload/images/bagel-cream-cheese.png", "/upload/images/bagel-cream-cheese1.png");

                saveMenu("겹겹이 초코 크로와상", "Layered Chocolate Croissant", "바삭한 결이 살아있는 크로와상에 진한 초콜릿이 듬뿍", 4800,
                                dessert.getId(), 1,
                                "/upload/images/chocolate-croissant.png");
                saveMenu("아몬드 쿠키", "Almond Cookie", "고소한 아몬드가 듬뿍 들어간 바삭한 쿠키", 3500, dessert.getId(), 2,
                                "/upload/images/almond-cookie.png");
                saveMenu("버터 쿠키", "Butter Cookie", "입안에서 사르르 녹는 부드러운 버터 풍미", 3000, dessert.getId(), 3,
                                "/upload/images/butter-cookie.png");
                saveMenu("초코칩 쿠키", "Choco Chip Cookie", "달콤한 초코칩이 박힌 남녀노소 인기 쿠키", 3500, dessert.getId(), 4,
                                "/upload/images/choco-chip-cookie.png");
                saveMenu("두바이 쫀득 쿠키", "Dubai Zzondeuk Cookie", "카이막과 피스타치오의 환상적인 풍미", 6500, dessert.getId(), 5,
                                "/upload/images/dubai-zzondeuk-cookie.png");
                saveMenu("초콜릿 무스", "Chocolate Mousse", "입안 가득 퍼지는 진하고 부드러운 초코 무스", 6000, dessert.getId(), 6,
                                "/upload/images/chocolate-mousse.png", "/upload/images/chocolate-mousse1.png");
                saveMenu("딸기 케이크", "Strawberry Cake", "신선한 생딸기와 생크림의 달콤한 조화", 7500, dessert.getId(), 7,
                                "/upload/images/strawberry-cake.png", "/upload/images/strawberry-cake1.png");
        }

        private AdminCategory findOrCreateCategory(String name, String icon, int sortOrder) {
                return categoryRepository.findByName(name)
                                .orElseGet(() -> categoryRepository.save(AdminCategory.builder()
                                                .name(name)
                                                .icon(icon)
                                                .sortOrder(sortOrder)
                                                .isActive(true)
                                                .build()));
        }

        private void saveMenu(String korName, String engName, String desc, int price, Long categoryId, int sortOrder,
                        String... imageUrls) {
                // 이미 존재하는 이름의 메뉴인 경우 건너뛰어 중복 방지 (사용자가 직접 수정한 데이터 보호)
                if (menuRepository.existsByKorName(korName)) {
                        return;
                }

                Menu menu = Menu.builder()
                                .korName(korName)
                                .engName(engName)
                                .description(desc)
                                .price(price)
                                .categoryId(categoryId)
                                .isAvailable(true)
                                .isSoldOut(false)
                                .sortOrder(sortOrder)
                                .build();
                menu = menuRepository.save(menu); // 실제 DB에 입력되어 생성된 메뉴를 반환 받음. menu.getId() 로 PK 획득 가능

                int imgOrder = 0;
                for (String url : imageUrls) {
                        AdminMenuImage image = AdminMenuImage.builder()
                                        .menuId(menu.getId())
                                        .srcUrl(url)
                                        .sortOrder(imgOrder++)
                                        .build();
                        menuImageRepository.save(image);
                }
        }
}
