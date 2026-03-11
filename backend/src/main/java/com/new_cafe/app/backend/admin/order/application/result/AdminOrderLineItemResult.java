package com.new_cafe.app.backend.admin.order.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AdminOrderLineItemResult {
    private final Long menuId;
    private final String menuName;
    private final int price;
    private final int quantity;
}
