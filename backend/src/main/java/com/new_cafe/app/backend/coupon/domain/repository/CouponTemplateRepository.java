package com.new_cafe.app.backend.coupon.domain.repository;

import com.new_cafe.app.backend.coupon.domain.model.CouponTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponTemplateRepository extends JpaRepository<CouponTemplate, Long> {
    Optional<CouponTemplate> findByName(String name);
}
