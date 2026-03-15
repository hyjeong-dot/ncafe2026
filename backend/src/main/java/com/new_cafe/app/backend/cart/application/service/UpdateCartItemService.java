package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.UpdateCartItemUseCase;
import com.new_cafe.app.backend.cart.application.command.UpdateCartItemCommand;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateCartItemService implements UpdateCartItemUseCase {

    private final CartPersistencePort cartPersistencePort;

    @Override
    @Transactional
    public void updateQuantity(UpdateCartItemCommand command) {
        Cart cart = cartPersistencePort.findByMemberId(command.getMemberId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(command.getMemberId()).build();
                    return cartPersistencePort.save(newCart);
                });
        
        // cart_items PK로 수량 변경
        cart.getItems().stream()
                .filter(item -> item.getId().equals(command.getCartItemId()))
                .findFirst()
                .ifPresent(item -> item.setQuantity(command.getQuantity()));
                
        cartPersistencePort.save(cart);
    }
}
