package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.AddCartItemUseCase;
import com.new_cafe.app.backend.cart.application.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import com.new_cafe.app.backend.cart.domain.model.CartItem;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddCartItemService implements AddCartItemUseCase {

    private final CartPersistencePort cartPersistencePort;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void addItem(AddCartItemCommand command) {
        Cart cart = cartPersistencePort.findByMemberId(command.getMemberId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(command.getMemberId()).build();
                    return cartPersistencePort.save(newCart);
                });
        
        // 옵션 이름 직렬화
        String optionNamesJson = null;
        if (command.getSelectedOptionNames() != null && !command.getSelectedOptionNames().isEmpty()) {
            try {
                optionNamesJson = objectMapper.writeValueAsString(command.getSelectedOptionNames());
            } catch (Exception e) {
                log.warn("Failed to serialize option names", e);
            }
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuId().equals(command.getMenuId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + command.getQuantity());
            // 옵션/가격이 새로 전달되면 업데이트
            if (optionNamesJson != null) {
                item.setSelectedOptionNames(optionNamesJson);
            }
            if (command.getUnitPrice() != null) {
                item.setUnitPrice(command.getUnitPrice());
            }
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .menuId(command.getMenuId())
                    .quantity(command.getQuantity())
                    .unitPrice(command.getUnitPrice())
                    .selectedOptionNames(optionNamesJson)
                    .build();
            cart.getItems().add(newItem);
        }
        
        cartPersistencePort.save(cart);
    }
}
