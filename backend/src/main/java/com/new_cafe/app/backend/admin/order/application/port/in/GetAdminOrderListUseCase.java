package com.new_cafe.app.backend.admin.order.application.port.in;

import com.new_cafe.app.backend.admin.order.application.result.AdminOrderResult;
import java.util.List;

public interface GetAdminOrderListUseCase {
    List<AdminOrderResult> getAllOrders();
}
