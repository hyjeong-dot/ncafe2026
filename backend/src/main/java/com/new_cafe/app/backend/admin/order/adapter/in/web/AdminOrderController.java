package com.new_cafe.app.backend.admin.order.adapter.in.web;

import com.new_cafe.app.backend.admin.order.application.port.in.GetAdminOrderListUseCase;
import com.new_cafe.app.backend.admin.order.application.port.in.UpdateOrderStatusUseCase;
import com.new_cafe.app.backend.admin.order.application.result.AdminOrderResult;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final GetAdminOrderListUseCase getAdminOrderListUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;
    private final OrderSseEmitters orderSseEmitters;

    @GetMapping
    public List<AdminOrderResult> getOrders() {
        return getAdminOrderListUseCase.getAllOrders();
    }

    @PatchMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        updateOrderStatusUseCase.updateStatus(id, status);
        // 상태 변경 시 모든 SSE 구독자에게 알림
        orderSseEmitters.notify("status-changed");
    }

    /**
     * 관리자 주문 SSE 스트림 구독
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamOrders() {
        return orderSseEmitters.add();
    }
}
