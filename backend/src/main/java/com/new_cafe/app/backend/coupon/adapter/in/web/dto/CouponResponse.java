package com.new_cafe.app.backend.coupon.adapter.in.web.dto;

import com.new_cafe.app.backend.coupon.domain.model.Coupon;
import com.new_cafe.app.backend.coupon.domain.model.CouponStatus;
import com.new_cafe.app.backend.coupon.domain.model.CouponType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CouponResponse {
    private Long id;
    private String name;
    private String description;
    private CouponType type;
    private int discount;
    private int minOrder;
    private String code;
    private CouponStatus status;
    private boolean usable;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static CouponResponse from(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .name(coupon.getTemplate().getName())
                .description(coupon.getTemplate().getDescription())
                .type(coupon.getTemplate().getType())
                .discount(coupon.getTemplate().getDiscount())
                .minOrder(coupon.getTemplate().getMinOrder())
                .code(coupon.getCode())
                .status(coupon.getStatus())
                .usable(coupon.isUsable())
                .expiresAt(coupon.getExpiresAt())
                .createdAt(coupon.getCreatedAt())
                .build();
    }
}
