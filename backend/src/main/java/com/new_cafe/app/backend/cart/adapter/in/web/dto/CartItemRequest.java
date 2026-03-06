package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import com.new_cafe.app.backend.cart.application.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.UpdateCartItemCommand;
import lombok.Data;
import java.util.UUID;

@Data
public class CartItemRequest {
    private Long menuId;
    private int quantity;

    public AddCartItemCommand toAddCommand(UUID memberId) {
        return AddCartItemCommand.builder()
                .memberId(memberId)
                .menuId(menuId)
                .quantity(quantity)
                .build();
    }

    public UpdateCartItemCommand toUpdateCommand(UUID memberId, Long menuId) {
        return UpdateCartItemCommand.builder()
                .memberId(memberId)
                .menuId(menuId)
                .quantity(quantity)
                .build();
    }
}
