package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.application.result.OrderResult;
import java.util.List;

public interface GetMyOrdersUseCase {
    List<OrderResult> getMyOrders(String username);
}
