package com.new_cafe.app.backend.cart.adapter.in.web;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long menuId;
    private int quantity;
}
