package com.new_cafe.app.backend.review.domain.repository;

import com.new_cafe.app.backend.review.domain.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByMemberIdOrderByCreatedAtDesc(UUID memberId);

    Optional<Review> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    /** 사용자의 리뷰 수 (스티커 지급 판단용) */
    long countByMemberId(UUID memberId);

    /** 특정 메뉴가 포함된 주문의 리뷰 조회 */
    @Query("SELECT r FROM Review r WHERE r.orderId IN " +
           "(SELECT oli.order.id FROM OrderLineItem oli WHERE oli.menuId = :menuId) " +
           "ORDER BY r.createdAt DESC")
    List<Review> findByMenuId(@Param("menuId") Long menuId);
}
