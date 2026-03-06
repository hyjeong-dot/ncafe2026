package com.new_cafe.app.backend.cart.adapter.out.persistence;

import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CartPersistenceAdapter implements CartPersistencePort {

    private final CartJpaRepository repository;

    @Override
    public Optional<Cart> findByMemberId(UUID memberId) {
        return repository.findByMemberId(memberId);
    }

    @Override
    public Cart save(Cart cart) {
        return repository.save(cart);
    }
}
