package com.new_cafe.app.backend.order.adapter.out.persistence.repository;

import com.new_cafe.app.backend.order.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByMemberIdOrderByCreatedAtDesc(UUID memberId);

    java.util.Optional<Order> findByOrderUid(String orderUid);

    long countByCreatedAtAfter(java.time.LocalDateTime createdAt);

    List<Order> findAllByCreatedAtAfter(java.time.LocalDateTime createdAt);
}
