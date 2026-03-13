package com.new_cafe.app.backend.order.application.result;

import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import com.new_cafe.app.backend.order.domain.model.OrderType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class OrderResult {
    private final Long orderId;
    private final String orderUid;
    private final int totalPrice;
    private final OrderType orderType;
    private final OrderStatus status;
    private final LocalDateTime createdAt;
}
