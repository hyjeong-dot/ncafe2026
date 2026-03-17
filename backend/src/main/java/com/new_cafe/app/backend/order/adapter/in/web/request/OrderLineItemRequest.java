package com.new_cafe.app.backend.order.adapter.in.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderLineItemRequest {
    private Long menuId;
    private int quantity;
    private Integer unitPrice; // 옵션 포함 단가 (null이면 메뉴 기본가 사용)
}
