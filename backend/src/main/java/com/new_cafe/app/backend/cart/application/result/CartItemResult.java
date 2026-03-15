package com.new_cafe.app.backend.cart.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CartItemResult {
    private String id;           // cart_items 테이블의 PK (고유 식별자)
    private Long menuId;         // 메뉴 ID (메뉴 정보 표시용)
    private String korName;
    private String engName;
    private int price;           // 옵션 포함 최종 단가
    private int quantity;
    private String image;
    private List<String> selectedOptionNames;  // 선택한 옵션 이름들
}
