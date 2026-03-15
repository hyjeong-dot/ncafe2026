package com.new_cafe.app.backend.coupon.domain.repository;

import com.new_cafe.app.backend.coupon.domain.model.Coupon;
import com.new_cafe.app.backend.coupon.domain.model.CouponStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    List<Coupon> findByMemberIdOrderByCreatedAtDesc(UUID memberId);

    List<Coupon> findByMemberIdAndStatus(UUID memberId, CouponStatus status);

    Optional<Coupon> findByIdAndMemberId(Long id, UUID memberId);

    boolean existsByMemberIdAndTemplate_Name(UUID memberId, String templateName);
}
