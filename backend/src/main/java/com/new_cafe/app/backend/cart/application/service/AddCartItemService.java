package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.AddCartItemUseCase;
import com.new_cafe.app.backend.cart.application.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import com.new_cafe.app.backend.cart.domain.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddCartItemService implements AddCartItemUseCase {

    private final CartPersistencePort cartPersistencePort;

    @Override
    @Transactional
    public void addItem(AddCartItemCommand command) {
        Cart cart = cartPersistencePort.findByMemberId(command.getMemberId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(command.getMemberId()).build();
                    return cartPersistencePort.save(newCart);
                });
        
        // 옵션 이름 직렬화 (쉼표 구분)
        String optionNamesStr = null;
        if (command.getSelectedOptionNames() != null && !command.getSelectedOptionNames().isEmpty()) {
            optionNamesStr = String.join(",", command.getSelectedOptionNames());
        }

        // 같은 메뉴 + 같은 옵션 조합인 경우에만 수량 증가
        final String finalOptionNamesStr = optionNamesStr;
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuId().equals(command.getMenuId())
                        && Objects.equals(item.getSelectedOptionNames(), finalOptionNamesStr))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + command.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .menuId(command.getMenuId())
                    .quantity(command.getQuantity())
                    .unitPrice(command.getUnitPrice())
                    .selectedOptionNames(optionNamesStr)
                    .build();
            cart.getItems().add(newItem);
        }
        
        cartPersistencePort.save(cart);
    }
}
