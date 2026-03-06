package com.new_cafe.app.backend.cart.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class ClearCartCommand {
    private final UUID memberId;
}
