package com.new_cafe.app.backend.cart.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class RemoveCartItemCommand {
    private final UUID memberId;
    private final Long cartItemId;  // cart_items 테이블의 PK
}
