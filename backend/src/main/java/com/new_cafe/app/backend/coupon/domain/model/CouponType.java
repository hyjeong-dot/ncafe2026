package com.new_cafe.app.backend.coupon.domain.model;

/**
 * 쿠폰 할인 타입
 */
public enum CouponType {
    FIXED,      // 정액 할인 (예: 3000원)
    PERCENT,    // 퍼센트 할인 (예: 10%)
    FREE_DRINK  // 무료 음료 (가장 비싼 1잔 무료)
}
