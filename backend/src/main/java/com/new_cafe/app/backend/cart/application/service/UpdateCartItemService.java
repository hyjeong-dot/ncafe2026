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
        
        cart.getItems().stream()
                .filter(item -> item.getMenuId().equals(command.getMenuId()))
                .findFirst()
                .ifPresent(item -> item.setQuantity(command.getQuantity()));
                
        cartPersistencePort.save(cart);
    }
}
