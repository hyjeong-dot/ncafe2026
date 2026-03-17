package com.new_cafe.app.backend.order.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderLineItemResult {
    private final Long menuId;
    private final String menuName;   // 메뉴 한글명
    private final String imageSrc;   // 메뉴 대표 이미지
    private final int price;         // 구매 당시 단가
    private final int quantity;
}
