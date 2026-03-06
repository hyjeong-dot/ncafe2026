package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.ClearCartUseCase;
import com.new_cafe.app.backend.cart.application.command.ClearCartCommand;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClearCartService implements ClearCartUseCase {

    private final CartPersistencePort cartPersistencePort;

    @Override
    @Transactional
    public void clearCart(ClearCartCommand command) {
        Cart cart = cartPersistencePort.findByMemberId(command.getMemberId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(command.getMemberId()).build();
                    return cartPersistencePort.save(newCart);
                });
                
        cart.getItems().clear();
        cartPersistencePort.save(cart);
    }
}
