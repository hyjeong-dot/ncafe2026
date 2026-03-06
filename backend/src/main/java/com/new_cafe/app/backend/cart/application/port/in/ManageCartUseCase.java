package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.application.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.UpdateCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.RemoveCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.ClearCartCommand;
import java.util.List;
import java.util.UUID;

public interface ManageCartUseCase {
    List<CartItemResult> getCartItems(UUID memberId);
    void addItem(AddCartItemCommand command);
    void updateQuantity(UpdateCartItemCommand command);
    void removeItem(RemoveCartItemCommand command);
    void clearCart(ClearCartCommand command);
}
