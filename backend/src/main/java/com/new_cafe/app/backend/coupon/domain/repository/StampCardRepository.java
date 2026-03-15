package com.new_cafe.app.backend.coupon.domain.repository;

import com.new_cafe.app.backend.coupon.domain.model.StampCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StampCardRepository extends JpaRepository<StampCard, Long> {

    Optional<StampCard> findByMemberIdAndCompletedFalse(UUID memberId);

    Optional<StampCard> findFirstByMemberIdOrderByCreatedAtDesc(UUID memberId);
}
