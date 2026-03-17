package com.new_cafe.app.backend.order.application.port.in.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderLineItemCommand {
    private final Long menuId;
    private final int quantity;
    private final Integer unitPrice; // 옵션 포함 단가 (null이면 메뉴 기본가 사용)
}
