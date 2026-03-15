package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.RemoveCartItemUseCase;
import com.new_cafe.app.backend.cart.application.command.RemoveCartItemCommand;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RemoveCartItemService implements RemoveCartItemUseCase {

    private final CartPersistencePort cartPersistencePort;

    @Override
    @Transactional
    public void removeItem(RemoveCartItemCommand command) {
        Cart cart = cartPersistencePort.findByMemberId(command.getMemberId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(command.getMemberId()).build();
                    return cartPersistencePort.save(newCart);
                });
        
        // cart_items PK로 삭제 (같은 메뉴라도 옵션이 다르면 각각 삭제 가능)
        cart.getItems().removeIf(item -> item.getId().equals(command.getCartItemId()));
        cartPersistencePort.save(cart);
    }
}
