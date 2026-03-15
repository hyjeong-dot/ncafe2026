package com.new_cafe.app.backend.coupon.application.service;

import com.new_cafe.app.backend.coupon.adapter.in.web.dto.CouponResponse;
import com.new_cafe.app.backend.coupon.adapter.in.web.dto.StampCardResponse;
import com.new_cafe.app.backend.coupon.domain.model.*;
import com.new_cafe.app.backend.coupon.domain.repository.*;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponTemplateRepository templateRepository;
    private final StampCardRepository stampCardRepository;
    private final LoadMemberPort loadMemberPort;

    /**
     * 첫 방문 쿠폰 발급 (회원가입 시)
     */
    @Transactional
    public CouponResponse issueWelcomeCoupon(UUID memberId) {
        String templateName = "첫 방문 1,000원 할인";

        // 이미 발급받았는지 체크
        if (couponRepository.existsByMemberIdAndTemplate_Name(memberId, templateName)) {
            throw new IllegalStateException("이미 첫 방문 쿠폰을 받으셨어요!");
        }

        CouponTemplate template = getOrCreateTemplate(templateName, CouponType.FIXED, 1000, 0,
                "회원가입 축하! 1,000원 할인 쿠폰이에요 💜", 30);

        Coupon coupon = createCoupon(template, memberId, "WELCOME");

        // 스탬프 카드도 함께 생성
        if (stampCardRepository.findByMemberIdAndCompletedFalse(memberId).isEmpty()) {
            stampCardRepository.save(StampCard.builder()
                    .memberId(memberId).stamps(0).completed(false).build());
        }

        return CouponResponse.from(coupon);
    }

    // 리뷰 이벤트는 실물 메타몽 스티커 증정 (선착순) → 디지털 쿠폰 발급 없음

    /**
     * 10잔 적립 완료 쿠폰 발급
     */
    @Transactional
    public CouponResponse issueStampRewardCoupon(UUID memberId) {
        CouponTemplate template = getOrCreateTemplate("아메리카노 무료 쿠폰", CouponType.FREE_DRINK, 4500, 0,
                "10잔 적립 완료! 아메리카노 한 잔 무료! ☕", 30);
        Coupon coupon = createCoupon(template, memberId, "STAMP");
        return CouponResponse.from(coupon);
    }

    /**
     * 내 쿠폰 목록 조회
     */
    @Transactional(readOnly = true)
    public List<CouponResponse> getMyCoupons(String username) {
        UUID memberId = getMemberId(username);
        return couponRepository.findByMemberIdOrderByCreatedAtDesc(memberId).stream()
                .map(CouponResponse::from).toList();
    }

    /**
     * 사용 가능한 쿠폰만 조회
     */
    @Transactional(readOnly = true)
    public List<CouponResponse> getMyActiveCoupons(String username) {
        UUID memberId = getMemberId(username);
        return couponRepository.findByMemberIdAndStatus(memberId, CouponStatus.ACTIVE).stream()
                .filter(Coupon::isUsable)
                .map(CouponResponse::from).toList();
    }

    /**
     * 쿠폰 사용 처리
     */
    @Transactional
    public void useCoupon(Long couponId, String username) {
        UUID memberId = getMemberId(username);
        Coupon coupon = couponRepository.findByIdAndMemberId(couponId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("쿠폰을 찾을 수 없습니다."));

        if (!coupon.isUsable()) {
            throw new IllegalStateException("사용할 수 없는 쿠폰입니다.");
        }

        coupon.use();
        couponRepository.save(coupon);
        log.info("Coupon used: {} by user: {}", couponId, username);
    }

    /**
     * 쿠폰 할인 계산 + 사용 처리 (주문 시 호출)
     * @return 할인 금액
     */
    @Transactional
    public int calculateAndUseCoupon(Long couponId, UUID memberId, int orderTotal) {
        Coupon coupon = couponRepository.findByIdAndMemberId(couponId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("쿠폰을 찾을 수 없습니다."));

        if (!coupon.isUsable()) {
            throw new IllegalStateException("사용할 수 없는 쿠폰입니다.");
        }

        int discount = coupon.calculateDiscount(orderTotal);
        coupon.use();
        couponRepository.save(coupon);
        log.info("Coupon {} used for order, discount: {}원", couponId, discount);
        return discount;
    }

    /**
     * 스탬프 추가 (주문 시 상품 수량만큼)
     */
    @Transactional
    public StampCardResponse addStamps(UUID memberId, int count) {
        StampCard card = stampCardRepository.findByMemberIdAndCompletedFalse(memberId)
                .orElseGet(() -> stampCardRepository.save(StampCard.builder()
                        .memberId(memberId).stamps(0).completed(false).build()));

        for (int i = 0; i < count; i++) {
            boolean completed = card.addStamp();
            if (completed) {
                stampCardRepository.save(card);
                issueStampRewardCoupon(memberId);
                log.info("Stamp card completed for member: {}", memberId);
                // 새 카드 생성 (남은 스탬프는 새 카드에 이어서)
                card = stampCardRepository.save(StampCard.builder()
                        .memberId(memberId).stamps(0).completed(false).build());
            }
        }

        stampCardRepository.save(card);
        return StampCardResponse.from(card);
    }

    /**
     * 쿠폰 복원 (주문 취소 시 사용된 쿠폰 되돌리기)
     */
    @Transactional
    public void restoreCoupon(Long couponId) {
        if (couponId == null) return;
        couponRepository.findById(couponId).ifPresent(coupon -> {
            coupon.restore();
            couponRepository.save(coupon);
            log.info("Coupon {} restored", couponId);
        });
    }

    /**
     * 스탬프 차감 (주문 취소 시 상품 수량만큼)
     * 10개 이하로 떨어지면 미사용 보상 쿠폰 회수
     */
    @Transactional
    public void removeStamps(UUID memberId, int count) {
        stampCardRepository.findByMemberIdAndCompletedFalse(memberId)
                .ifPresent(card -> {
                    for (int i = 0; i < count; i++) {
                        card.removeStamp();
                    }
                    stampCardRepository.save(card);
                    log.info("Stamps removed ({}) for member: {}", count, memberId);
                });

        // 미사용 아메리카노 보상 쿠폰이 있으면 회수 (스탬프 부족 시)
        revokeUnusedStampRewardIfNeeded(memberId);
    }

    /**
     * 미사용 스탬프 보상 쿠폰 회수
     */
    private void revokeUnusedStampRewardIfNeeded(UUID memberId) {
        // 현재 활성 카드의 스탬프가 0이고, 미사용 아메리카노 쿠폰이 있으면 회수
        StampCard currentCard = stampCardRepository.findByMemberIdAndCompletedFalse(memberId).orElse(null);
        if (currentCard != null && currentCard.getStamps() == 0) {
            couponRepository.findByMemberIdAndStatus(memberId, CouponStatus.ACTIVE).stream()
                    .filter(c -> "아메리카노 무료 쿠폰".equals(c.getTemplate().getName()))
                    .forEach(c -> {
                        c.setStatus(CouponStatus.EXPIRED);
                        couponRepository.save(c);
                        log.info("Unused stamp reward coupon {} revoked for member: {}", c.getId(), memberId);
                    });
        }
    }

    /**
     * 내 스탬프 카드 조회
     */
    @Transactional(readOnly = true)
    public StampCardResponse getMyStampCard(String username) {
        UUID memberId = getMemberId(username);
        StampCard card = stampCardRepository.findByMemberIdAndCompletedFalse(memberId)
                .orElse(StampCard.builder().memberId(memberId).stamps(0).completed(false).build());
        return StampCardResponse.from(card);
    }

    // -- Helper --

    private CouponTemplate getOrCreateTemplate(String name, CouponType type, int discount,
                                                int minOrder, String description, int validityDays) {
        return templateRepository.findByName(name)
                .orElseGet(() -> templateRepository.save(CouponTemplate.builder()
                        .name(name).type(type).discount(discount).minOrder(minOrder)
                        .description(description).validityDays(validityDays).build()));
    }

    private Coupon createCoupon(CouponTemplate template, UUID memberId, String prefix) {
        String code = prefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Coupon coupon = Coupon.builder()
                .template(template).memberId(memberId).code(code)
                .status(CouponStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusDays(template.getValidityDays()))
                .build();
        return couponRepository.save(coupon);
    }

    private UUID getMemberId(String username) {
        return loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                .getId();
    }
}
