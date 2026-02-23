-- 카테고리 데이터
INSERT INTO categories (id, name, icon, sort_order, is_active, created_at, updated_at) VALUES
(1, 'Signature', '✨', 1, true, NOW(), NOW()),
(2, 'Coffee', '☕', 2, true, NOW(), NOW()),
(3, 'Sandwich & Bagel', '🥪', 3, true, NOW(), NOW()),
(4, 'Dessert', '🍰', 4, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    icon = EXCLUDED.icon, 
    sort_order = EXCLUDED.sort_order, 
    is_active = EXCLUDED.is_active, 
    updated_at = NOW();

-- 메뉴 데이터
INSERT INTO menus (id, kor_name, eng_name, description, price, category_id, is_available, is_sold_out, sort_order, created_at, updated_at) VALUES
(1, '2026 시그니처', '2026 Signature', 'NCafe 2026의 감성을 담은 특별한 시그니처 음료', 7000, 1, true, false, 1, NOW(), NOW()),
(2, '바나나 크림 라떼', 'Banana Cream Latte', '달콤한 바나나 크림이 올라간 부드러운 라떼', 6500, 1, true, false, 2, NOW(), NOW()),
(3, '아메리카노', 'Americano', '깊고 진한 풍미의 프리미엄 아메리카노', 4500, 2, true, false, 1, NOW(), NOW()),
(4, '카페 라떼', 'Cafe Latte', '에스프레소와 우유의 고소한 조화', 5000, 2, true, false, 2, NOW(), NOW()),
(5, '카푸치노', 'Cappuccino', '부드러운 우유 거품과 시나몬의 향긋함', 5500, 2, true, false, 3, NOW(), NOW()),
(6, '카라멜 마끼아또', 'Caramel Macchiato', '달콤한 카라멜 시럽과 부드러운 거품', 5800, 2, true, false, 4, NOW(), NOW()),
(7, '에스프레소', 'Espresso', '이탈리안 정통 스타일의 진한 에스프레소', 4000, 2, true, false, 5, NOW(), NOW()),
(8, '햄 치즈 샌드위치', 'Ham & Cheese Sandwich', '신선한 야채와 고소한 햄, 치즈의 만남', 7500, 3, true, false, 1, NOW(), NOW()),
(9, '에그 스크램블 샌드위치', 'Scrambled Egg Sandwich', '부드러운 에그 스크램블이 가득한 영양 만점 샌드위치', 7800, 3, true, false, 2, NOW(), NOW()),
(10, '참치 샌드위치', 'Tuna Sandwich', '담백한 참치 마요네즈와 신선한 야채', 7500, 3, true, false, 3, NOW(), NOW()),
(11, '터키 샌드위치', 'Turkey Sandwich', '저칼로리 터키 햄으로 건강하게 즐기는 샌드위치', 8000, 3, true, false, 4, NOW(), NOW()),
(12, '비프 베이글', 'Beef Bagel', '육즙 가득한 소고기와 쫄깃한 베이글', 8500, 3, true, false, 5, NOW(), NOW()),
(13, '크림 치즈 베이글', 'Bagel with Cream Cheese', '꾸덕한 크림 치즈를 듬뿍 바른 클래식 베이글', 5500, 3, true, false, 6, NOW(), NOW()),
(14, '아몬드 쿠키', 'Almond Cookie', '고소한 아몬드가 듬뿍 들어간 바삭한 쿠키', 3500, 4, true, false, 1, NOW(), NOW()),
(15, '버터 쿠키', 'Butter Cookie', '입안에서 사르르 녹는 부드러운 버터 풍미', 3000, 4, true, false, 2, NOW(), NOW()),
(16, '초코칩 쿠키', 'Choco Chip Cookie', '달콤한 초코칩이 박힌 남녀노소 인기 쿠키', 3500, 4, true, false, 3, NOW(), NOW()),
(17, '두바이 쫀득 쿠키', 'Dubai Zzondeuk Cookie', '카이막과 피스타치오의 환상적인 풍미', 6500, 4, true, false, 4, NOW(), NOW()),
(18, '초콜릿 크로와상', 'Chocolate Croissant', '결이 살아있는 크로와상 속에 진한 초콜릿', 4800, 4, true, false, 5, NOW(), NOW()),
(19, '초콜릿 무스', 'Chocolate Mousse', '입안 가득 퍼지는 진하고 부드러운 초코 무스', 6000, 4, true, false, 6, NOW(), NOW()),
(20, '딸기 케이크', 'Strawberry Cake', '신선한 생딸기와 생크림의 달콤한 조화', 7500, 4, true, false, 7, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    kor_name = EXCLUDED.kor_name, 
    eng_name = EXCLUDED.eng_name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    category_id = EXCLUDED.category_id, 
    updated_at = NOW();

-- 메뉴 이미지 데이터
INSERT INTO menu_images (id, menu_id, src_url, sort_order, created_at) VALUES
(1, 1, '/upload/images/signature.png', 1, NOW()),
(2, 1, '/upload/images/signature1.png', 2, NOW()),
(3, 2, '/upload/images/bananalatte.png', 1, NOW()),
(4, 2, '/upload/images/bananalatte1.png', 2, NOW()),
(5, 3, '/upload/images/americano.png', 1, NOW()),
(6, 3, '/upload/images/americano1.png', 2, NOW()),
(7, 4, '/upload/images/cafelatte.png', 1, NOW()),
(8, 4, '/upload/images/cafelatte1.png', 2, NOW()),
(9, 5, '/upload/images/capuchino.png', 1, NOW()),
(10, 5, '/upload/images/capuchino1.png', 2, NOW()),
(11, 6, '/upload/images/caramel-macchiato.png', 1, NOW()),
(12, 6, '/upload/images/caramel-macchiato1.png', 2, NOW()),
(13, 7, '/upload/images/espresso.png', 1, NOW()),
(14, 7, '/upload/images/espresso1.png', 2, NOW()),
(15, 8, '/upload/images/ham-cheese-sandwich.png', 1, NOW()),
(16, 8, '/upload/images/ham-cheese-sandwich1.png', 2, NOW()),
(17, 9, '/upload/images/scrambled-egg-sandwich.png', 1, NOW()),
(18, 9, '/upload/images/scrambled-egg-sandwich1.png', 2, NOW()),
(19, 10, '/upload/images/tuna-sandwich.png', 1, NOW()),
(20, 10, '/upload/images/tuna-sandwich1.png', 2, NOW()),
(21, 11, '/upload/images/turkey-sandwich.png', 1, NOW()),
(22, 11, '/upload/images/turkey-sandwich1.png', 2, NOW()),
(23, 12, '/upload/images/beef-bagel.png', 1, NOW()),
(24, 12, '/upload/images/beef-bagel1.png', 2, NOW()),
(25, 13, '/upload/images/bagel-cream-cheese.png', 1, NOW()),
(26, 13, '/upload/images/bagel-cream-cheese1.png', 2, NOW()),
(27, 14, '/upload/images/almond-cookie.png', 1, NOW()),
(28, 14, '/upload/images/almond-cookie1.png', 2, NOW()),
(29, 15, '/upload/images/butter-cookie.png', 1, NOW()),
(30, 15, '/upload/images/butter-cookie1.png', 2, NOW()),
(31, 16, '/upload/images/choco-chip-cookie.png', 1, NOW()),
(32, 16, '/upload/images/choco-chip-cookie1.png', 2, NOW()),
(33, 17, '/upload/images/dubai-zzondeuk-cookie.png', 1, NOW()),
(34, 17, '/upload/images/dubai-zzondeuk-cookie1.png', 2, NOW()),
(35, 18, '/upload/images/chocolate-croissant.png', 1, NOW()),
(36, 18, '/upload/images/chocolate-croissant1.png', 2, NOW()),
(37, 19, '/upload/images/chocolate-mousse.png', 1, NOW()),
(38, 19, '/upload/images/chocolate-mousse1.png', 2, NOW()),
(39, 20, '/upload/images/strawberry-cake.png', 1, NOW()),
(40, 20, '/upload/images/strawberry-cake1.png', 2, NOW())
ON CONFLICT (id) DO UPDATE SET 
    menu_id = EXCLUDED.menu_id, 
    src_url = EXCLUDED.src_url, 
    sort_order = EXCLUDED.sort_order;
