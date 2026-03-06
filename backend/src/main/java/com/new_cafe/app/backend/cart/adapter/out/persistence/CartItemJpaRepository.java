package com.new_cafe.app.backend.cart.adapter.out.persistence;

import com.new_cafe.app.backend.cart.domain.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemJpaRepository extends JpaRepository<CartItem, Long> {
}
