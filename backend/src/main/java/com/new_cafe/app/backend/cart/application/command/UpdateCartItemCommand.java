package com.new_cafe.app.backend.cart.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class UpdateCartItemCommand {
    private final UUID memberId;
    private final Long cartItemId;  // cart_items 테이블의 PK
    private final int quantity;
}
