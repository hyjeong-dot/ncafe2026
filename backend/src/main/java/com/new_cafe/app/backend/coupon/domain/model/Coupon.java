package com.new_cafe.app.backend.coupon.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 사용자에게 발급된 쿠폰
 */
@Entity
@Table(name = "coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "template_id", nullable = false)
    private CouponTemplate template;

    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    @Column(unique = true, nullable = false, length = 20)
    private String code; // 'WELCOME-A1B2'

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CouponStatus status = CouponStatus.ACTIVE;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // -- 비즈니스 로직 --

    public boolean isUsable() {
        return status == CouponStatus.ACTIVE && expiresAt.isAfter(LocalDateTime.now());
    }

    public void use() {
        this.status = CouponStatus.USED;
        this.usedAt = LocalDateTime.now();
    }

    /**
     * 할인 금액 계산
     */
    public int calculateDiscount(int orderTotal) {
        if (!isUsable()) return 0;
        if (orderTotal < template.getMinOrder()) return 0;

        return switch (template.getType()) {
            case FIXED -> Math.min(template.getDiscount(), orderTotal);
            case PERCENT -> orderTotal * template.getDiscount() / 100;
            case FREE_DRINK -> Math.min(template.getDiscount(), orderTotal); // 아메리카노 가격(4500원) 고정 할인
        };
    }
}
