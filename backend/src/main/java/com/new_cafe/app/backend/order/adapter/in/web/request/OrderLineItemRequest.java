package com.new_cafe.app.backend.order.adapter.in.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderLineItemRequest {
    private Long menuId;
    private int quantity;
}
