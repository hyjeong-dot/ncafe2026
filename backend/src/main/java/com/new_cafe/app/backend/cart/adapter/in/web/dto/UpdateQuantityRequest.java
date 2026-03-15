package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import com.new_cafe.app.backend.cart.application.command.UpdateCartItemCommand;
import lombok.Data;
import java.util.UUID;

/**
 * 장바구니 수량 변경 요청 DTO
 */
@Data
public class UpdateQuantityRequest {
    private int quantity;

    public UpdateCartItemCommand toCommand(UUID memberId, Long cartItemId) {
        return UpdateCartItemCommand.builder()
                .memberId(memberId)
                .cartItemId(cartItemId)
                .quantity(quantity)
                .build();
    }
}
