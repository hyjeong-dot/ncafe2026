package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.ManageCartUseCase;
import com.new_cafe.app.backend.cart.application.port.out.CartPersistencePort;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.domain.model.Cart;
import com.new_cafe.app.backend.cart.domain.model.CartItem;
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
public class ManageCartService implements ManageCartUseCase {

    private final CartPersistencePort cartPersistencePort;
    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;

    @Override
    public List<CartItemResult> getCartItems(UUID memberId) {
        Cart cart = getOrCreateCart(memberId);
        
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

    @Override
    @Transactional
    public void addItem(UUID memberId, Long menuId, int quantity) {
        Cart cart = getOrCreateCart(memberId);
        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuId().equals(menuId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .menuId(menuId)
                    .quantity(quantity)
                    .build();
            cart.getItems().add(newItem);
        }
        
        cartPersistencePort.save(cart);
    }

    @Override
    @Transactional
    public void updateQuantity(UUID memberId, Long menuId, int quantity) {
        Cart cart = getOrCreateCart(memberId);
        
        cart.getItems().stream()
                .filter(item -> item.getMenuId().equals(menuId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
                
        cartPersistencePort.save(cart);
    }

    @Override
    @Transactional
    public void removeItem(UUID memberId, Long menuId) {
        Cart cart = getOrCreateCart(memberId);
        cart.getItems().removeIf(item -> item.getMenuId().equals(menuId));
        cartPersistencePort.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(UUID memberId) {
        Cart cart = getOrCreateCart(memberId);
        cart.getItems().clear();
        cartPersistencePort.save(cart);
    }

    private Cart getOrCreateCart(UUID memberId) {
        return cartPersistencePort.findByMemberId(memberId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().memberId(memberId).build();
                    return cartPersistencePort.save(newCart);
                });
    }
}
