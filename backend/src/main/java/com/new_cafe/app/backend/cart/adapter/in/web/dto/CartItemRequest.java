package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import com.new_cafe.app.backend.cart.application.command.AddCartItemCommand;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CartItemRequest {
    private Long menuId;
    private int quantity;
    private Integer unitPrice;                // 옵션 포함 단가
    private List<String> selectedOptionNames; // 선택한 옵션 이름들

    public AddCartItemCommand toAddCommand(UUID memberId) {
        return AddCartItemCommand.builder()
                .memberId(memberId)
                .menuId(menuId)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .selectedOptionNames(selectedOptionNames)
                .build();
    }
}
