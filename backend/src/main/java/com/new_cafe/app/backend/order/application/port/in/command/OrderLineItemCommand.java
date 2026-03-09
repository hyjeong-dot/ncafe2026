package com.new_cafe.app.backend.order.application.port.in.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderLineItemCommand {
    private final Long menuId;
    private final int quantity;
}
