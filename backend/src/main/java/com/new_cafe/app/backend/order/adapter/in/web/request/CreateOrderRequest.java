package com.new_cafe.app.backend.order.adapter.in.web.request;

import com.new_cafe.app.backend.order.application.port.in.command.CreateOrderCommand;
import com.new_cafe.app.backend.order.application.port.in.command.OrderLineItemCommand;
import com.new_cafe.app.backend.order.domain.model.OrderType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CreateOrderRequest {
    private String orderType; // DINE_IN or TAKEOUT
    private String requestMemo;
    private Long couponId; // nullable
    private List<OrderLineItemRequest> items;

    public CreateOrderCommand toCommand(String username) {
        return CreateOrderCommand.builder()
                .username(username)
                .orderType(OrderType.valueOf(this.orderType))
                .requestMemo(this.requestMemo)
                .couponId(this.couponId)
                .items(this.items.stream()
                        .map(item -> OrderLineItemCommand.builder()
                                .menuId(item.getMenuId())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
