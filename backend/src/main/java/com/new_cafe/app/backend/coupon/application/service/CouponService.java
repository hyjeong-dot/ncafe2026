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
        CouponTemplate template = getOrCreateTemplate("아메리카노 무료 쿠폰", CouponType.FREE_DRINK, 0, 0,
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
     * 스탬프 추가 (주문 완료 시 호출)
     */
    @Transactional
    public StampCardResponse addStamp(UUID memberId) {
        StampCard card = stampCardRepository.findByMemberIdAndCompletedFalse(memberId)
                .orElseGet(() -> stampCardRepository.save(StampCard.builder()
                        .memberId(memberId).stamps(0).completed(false).build()));

        boolean completed = card.addStamp();
        stampCardRepository.save(card);

        if (completed) {
            issueStampRewardCoupon(memberId);
            // 새 카드 생성
            stampCardRepository.save(StampCard.builder()
                    .memberId(memberId).stamps(0).completed(false).build());
            log.info("Stamp card completed for member: {}", memberId);
        }

        return StampCardResponse.from(card);
    }

    /**
     * 스탬프 차감 (주문 취소 시 호출)
     */
    @Transactional
    public void removeStamp(UUID memberId) {
        stampCardRepository.findByMemberIdAndCompletedFalse(memberId)
                .ifPresent(card -> {
                    card.removeStamp();
                    stampCardRepository.save(card);
                    log.info("Stamp removed for member: {}", memberId);
                });
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
