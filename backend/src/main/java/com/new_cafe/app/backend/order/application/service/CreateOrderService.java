package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.coupon.application.service.CouponService;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.order.application.port.in.CreateOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.command.CreateOrderCommand;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.application.result.OrderResult;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderLineItem;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreateOrderService implements CreateOrderUseCase {

    private final OrderPort orderPort;
    private final LoadMenuPort loadMenuPort;
    private final LoadMemberPort loadMemberPort;
    private final CouponService couponService;

    @Override
    @Transactional
    public OrderResult createOrder(CreateOrderCommand command) {
        Member member = loadMemberPort.findByUsername(command.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        String orderUid = "ORDER-" + System.currentTimeMillis() + "-" + java.util.UUID.randomUUID().toString().substring(0, 8);

        Order order = Order.builder()
                .memberId(member.getId())
                .orderType(command.getOrderType())
                .requestMemo(command.getRequestMemo())
                .orderUid(orderUid)
                .status(OrderStatus.PENDING)
                .build();

        command.getItems().forEach(itemCmd -> {
            Menu menu = loadMenuPort.findAvailableById(itemCmd.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu not found or not available: " + itemCmd.getMenuId()));

            OrderLineItem lineItem = OrderLineItem.builder()
                    .menuId(menu.getId())
                    .price(menu.getPrice())
                    .quantity(itemCmd.getQuantity())
                    .build();

            order.addLineItem(lineItem);
        });

        order.calculateTotalPrice();
        Order savedOrder = orderPort.saveOrder(order);

        // 스탬프 카드 적립
        try {
            couponService.addStamp(member.getId());
            log.info("Stamp added for member: {}", member.getUsername());
        } catch (Exception e) {
            log.warn("Failed to add stamp for member: {}", member.getUsername(), e);
        }

        return OrderResult.builder()
                .orderId(savedOrder.getId())
                .orderUid(savedOrder.getOrderUid())
                .totalPrice(savedOrder.getTotalPrice())
                .orderType(savedOrder.getOrderType())
                .status(savedOrder.getStatus())
                .createdAt(savedOrder.getCreatedAt())
                .build();
    }
}
