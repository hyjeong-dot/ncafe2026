package com.new_cafe.app.backend.cart.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class AddCartItemCommand {
    private final UUID memberId;
    private final Long menuId;
    private final int quantity;
}
