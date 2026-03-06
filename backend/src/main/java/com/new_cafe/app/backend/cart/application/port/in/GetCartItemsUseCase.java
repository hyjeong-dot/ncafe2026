package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import java.util.List;
import java.util.UUID;

public interface GetCartItemsUseCase {
    List<CartItemResult> getCartItems(UUID memberId);
}
