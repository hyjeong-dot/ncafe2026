package com.new_cafe.app.backend.cart.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResult {
    private String id;
    private String korName;
    private String engName;
    private int price;
    private int quantity;
    private String image;
}
