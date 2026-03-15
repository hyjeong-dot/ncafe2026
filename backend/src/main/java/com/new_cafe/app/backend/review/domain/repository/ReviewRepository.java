package com.new_cafe.app.backend.review.domain.repository;

import com.new_cafe.app.backend.review.domain.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByMemberIdOrderByCreatedAtDesc(UUID memberId);

    Optional<Review> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    /** 사용자의 리뷰 수 (스티커 지급 판단용) */
    long countByMemberId(UUID memberId);
}
