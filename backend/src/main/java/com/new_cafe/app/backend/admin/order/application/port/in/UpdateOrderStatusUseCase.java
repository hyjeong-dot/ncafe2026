package com.new_cafe.app.backend.admin.order.application.port.in;

import com.new_cafe.app.backend.order.domain.model.OrderStatus;

public interface UpdateOrderStatusUseCase {
    void updateStatus(Long orderId, OrderStatus status);
}
