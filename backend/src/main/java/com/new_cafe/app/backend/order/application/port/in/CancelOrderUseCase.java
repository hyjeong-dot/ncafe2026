package com.new_cafe.app.backend.order.application.port.in;

public interface CancelOrderUseCase {
    void cancelOrder(Long orderId, String username);
}
