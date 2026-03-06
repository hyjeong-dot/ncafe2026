package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.command.ClearCartCommand;

public interface ClearCartUseCase {
    void clearCart(ClearCartCommand command);
}
