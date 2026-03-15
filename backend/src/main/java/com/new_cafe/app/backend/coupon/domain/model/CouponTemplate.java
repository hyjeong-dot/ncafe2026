package com.new_cafe.app.backend.coupon.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 쿠폰 템플릿 (관리자가 정의하는 쿠폰 종류)
 */
@Entity
@Table(name = "coupon_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // '첫 방문 무료 음료', '리뷰 감사 할인'

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CouponType type; // FIXED, PERCENT, FREE_DRINK

    @Column(nullable = false)
    private int discount; // 할인 금액(원) 또는 퍼센트(%)

    @Column(name = "min_order")
    private int minOrder; // 최소 주문 금액

    @Column(length = 500)
    private String description;

    @Column(name = "validity_days", nullable = false)
    private int validityDays; // 발급일로부터 유효 일수

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
