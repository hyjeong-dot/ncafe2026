package com.new_cafe.app.backend.cart.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class AddCartItemCommand {
    private final UUID memberId;
    private final Long menuId;
    private final int quantity;
    private final Integer unitPrice;                // 옵션 포함 단가
    private final List<String> selectedOptionNames; // 선택한 옵션 이름들
}
