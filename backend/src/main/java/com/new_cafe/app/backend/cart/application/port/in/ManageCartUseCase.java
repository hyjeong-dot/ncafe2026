package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import java.util.List;
import java.util.UUID;

public interface ManageCartUseCase {
    List<CartItemResult> getCartItems(UUID memberId);
    void addItem(UUID memberId, Long menuId, int quantity);
    void updateQuantity(UUID memberId, Long menuId, int quantity);
    void removeItem(UUID memberId, Long menuId);
    void clearCart(UUID memberId);
}
