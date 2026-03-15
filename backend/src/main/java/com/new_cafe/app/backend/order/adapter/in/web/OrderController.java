package com.new_cafe.app.backend.order.adapter.in.web;

import com.new_cafe.app.backend.admin.order.adapter.in.web.OrderSseEmitters;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.order.adapter.in.web.request.CreateOrderRequest;
import com.new_cafe.app.backend.order.application.port.in.CreateOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.GetMyOrdersUseCase;
import com.new_cafe.app.backend.order.application.port.in.CancelOrderUseCase;
import com.new_cafe.app.backend.order.application.result.OrderResult;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final GetMyOrdersUseCase getMyOrdersUseCase;
    private final CancelOrderUseCase cancelOrderUseCase;
    private final OrderSseEmitters orderSseEmitters;

    @PostMapping
    public OrderResult createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationFailedException();
        }

        OrderResult result = createOrderUseCase.createOrder(request.toCommand(authentication.getName()));
        // 새 주문 생성 시 관리자 SSE 구독자에게 알림
        orderSseEmitters.notify("new-order");
        return result;
    }

    @GetMapping
    public List<OrderResult> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationFailedException();
        }

        return getMyOrdersUseCase.getMyOrders(authentication.getName());
    }

    @PatchMapping("/{orderId}/cancel")
    public void cancelOrder(@PathVariable Long orderId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationFailedException();
        }

        cancelOrderUseCase.cancelOrder(orderId, authentication.getName());
    }
}
