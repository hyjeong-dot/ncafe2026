package com.new_cafe.app.backend.coupon.adapter.in.web;

import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.coupon.adapter.in.web.dto.CouponResponse;
import com.new_cafe.app.backend.coupon.adapter.in.web.dto.StampCardResponse;
import com.new_cafe.app.backend.coupon.application.service.CouponService;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final LoadMemberPort loadMemberPort;

    /**
     * 첫 방문 쿠폰 발급
     */
    @PostMapping("/welcome")
    public CouponResponse issueWelcomeCoupon(Authentication authentication) {
        Member member = getMember(authentication);
        return couponService.issueWelcomeCoupon(member.getId());
    }

    /**
     * 내 쿠폰 전체 목록
     */
    @GetMapping
    public List<CouponResponse> getMyCoupons(Authentication authentication) {
        return couponService.getMyCoupons(getUsername(authentication));
    }

    /**
     * 사용 가능한 쿠폰만 조회
     */
    @GetMapping("/active")
    public List<CouponResponse> getMyActiveCoupons(Authentication authentication) {
        return couponService.getMyActiveCoupons(getUsername(authentication));
    }

    /**
     * 쿠폰 사용
     */
    @PostMapping("/{couponId}/use")
    public void useCoupon(@PathVariable Long couponId, Authentication authentication) {
        couponService.useCoupon(couponId, getUsername(authentication));
    }

    /**
     * 내 스탬프 카드 조회
     */
    @GetMapping("/stamp-card")
    public StampCardResponse getMyStampCard(Authentication authentication) {
        return couponService.getMyStampCard(getUsername(authentication));
    }

    private String getUsername(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationFailedException();
        }
        return authentication.getName();
    }

    private Member getMember(Authentication authentication) {
        String username = getUsername(authentication);
        return loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
    }
}
