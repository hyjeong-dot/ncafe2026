package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.GetCartItemsUseCase;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetCartItemsService implements GetCartItemsUseCase {

    private final CartPersistencePort cartPersistencePort;
    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;

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

            return CartItemResult.builder()
                    .id(String.valueOf(menu.getId()))
                    .korName(menu.getKorName())
                    .engName(menu.getEngName())
                    .price(menu.getPrice())
                    .quantity(item.getQuantity())
                    .image(imageUrl)
                    .build();
        }).filter(item -> item != null).collect(Collectors.toList());
    }
}
