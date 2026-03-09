package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.application.port.in.command.CreateOrderCommand;
import com.new_cafe.app.backend.order.application.result.OrderResult;

public interface CreateOrderUseCase {
    OrderResult createOrder(CreateOrderCommand command);
}
