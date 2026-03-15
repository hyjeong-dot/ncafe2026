package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.GetCartItemsUseCase;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class GetCartItemsService implements GetCartItemsUseCase {

    private final CartPersistencePort cartPersistencePort;
    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;
    private final ObjectMapper objectMapper;

    @Override
    public List<CartItemResult> getCartItems(UUID memberId) {
        Cart cart = cartPersistencePort.findByMemberId(memberId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(memberId).build();
                    return cartPersistencePort.save(newCart);
                });
        
        return cart.getItems().stream().map(item -> {
            Optional<Menu> menuOpt = loadMenuPort.findAvailableById(item.getMenuId());
            if (menuOpt.isEmpty()) return null;
            
            Menu menu = menuOpt.get();
            List<MenuImage> images = loadMenuImagePort.findAllByMenuId(menu.getId());
            String imageUrl = images.isEmpty() ? null : images.get(0).getSrcUrl();

            // 옵션 이름 역직렬화
            List<String> optionNames = Collections.emptyList();
            if (item.getSelectedOptionNames() != null) {
                try {
                    optionNames = objectMapper.readValue(
                            item.getSelectedOptionNames(),
                            new TypeReference<List<String>>() {}
                    );
                } catch (Exception e) {
                    log.warn("Failed to deserialize option names for cart item {}", item.getId(), e);
                }
            }

            // 가격: unitPrice가 있으면 사용, 없으면 메뉴 기본 가격
            int price = item.getUnitPrice() != null ? item.getUnitPrice() : menu.getPrice();

            return CartItemResult.builder()
                    .id(String.valueOf(item.getId()))       // cart_items PK
                    .menuId(menu.getId())                   // 메뉴 ID
                    .korName(menu.getKorName())
                    .engName(menu.getEngName())
                    .price(price)
                    .quantity(item.getQuantity())
                    .image(imageUrl)
                    .selectedOptionNames(optionNames.isEmpty() ? null : optionNames)
                    .build();
        }).filter(item -> item != null).collect(Collectors.toList());
    }
}
