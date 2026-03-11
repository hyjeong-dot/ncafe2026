package com.new_cafe.app.backend.admin.order.adapter.in.web;

import com.new_cafe.app.backend.admin.order.application.port.in.GetAdminOrderListUseCase;
import com.new_cafe.app.backend.admin.order.application.port.in.UpdateOrderStatusUseCase;
import com.new_cafe.app.backend.admin.order.application.result.AdminOrderResult;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final GetAdminOrderListUseCase getAdminOrderListUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;

    @GetMapping
    public List<AdminOrderResult> getOrders() {
        return getAdminOrderListUseCase.getAllOrders();
    }

    @PatchMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        updateOrderStatusUseCase.updateStatus(id, status);
    }
}
