package com.new_cafe.app.backend.admin.order.application.service;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.AdminMenuJpaRepository;
import com.new_cafe.app.backend.admin.order.application.port.in.GetAdminOrderListUseCase;
import com.new_cafe.app.backend.admin.order.application.port.in.UpdateOrderStatusUseCase;
import com.new_cafe.app.backend.admin.order.application.result.AdminOrderLineItemResult;
import com.new_cafe.app.backend.admin.order.application.result.AdminOrderResult;
import com.new_cafe.app.backend.coupon.application.service.CouponService;
import com.new_cafe.app.backend.member.adapter.out.persistence.MemberJpaRepository;
import com.new_cafe.app.backend.order.adapter.out.persistence.repository.OrderRepository;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminOrderService implements GetAdminOrderListUseCase, UpdateOrderStatusUseCase {

    private final OrderRepository orderRepository;
    private final MemberJpaRepository memberRepository;
    private final AdminMenuJpaRepository menuRepository;
    private final CouponService couponService;

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderResult> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .map(this::toResult)
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setStatus(status);
        orderRepository.save(order);

        // 취소 시 스탬프 차감 (주문 생성 시 상품 수량만큼 적립했으므로)
        if (status == OrderStatus.CANCELLED) {
            try {
                int totalQuantity = order.getItems().stream()
                        .mapToInt(item -> item.getQuantity())
                        .sum();
                couponService.removeStamps(order.getMemberId(), totalQuantity);
                log.info("Stamps removed ({}) for cancelled order {}", totalQuantity, orderId);
            } catch (Exception e) {
                log.warn("Stamp removal failed for order {}: {}", orderId, e.getMessage());
            }
        }
    }

    private AdminOrderResult toResult(Order order) {
        String nickname = memberRepository.findById(order.getMemberId())
                .map(member -> member.getNickname())
                .orElse("Unknown");

        List<AdminOrderLineItemResult> itemResults = order.getItems().stream()
                .map(item -> {
                    String menuName = menuRepository.findById(item.getMenuId())
                            .map(menu -> menu.getKorName())
                            .orElse("Deleted Menu");
                    
                    return AdminOrderLineItemResult.builder()
                            .menuId(item.getMenuId())
                            .menuName(menuName)
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());

        return AdminOrderResult.builder()
                .id(order.getId())
                .memberId(order.getMemberId())
                .nickname(nickname)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .statusLabel(getStatusLabel(order.getStatus()))
                .orderType(order.getOrderType().name())
                .requestMemo(order.getRequestMemo())
                .items(itemResults)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private String getStatusLabel(OrderStatus status) {
        switch (status) {
            case PENDING: return "결제 대기";
            case PAID: return "결제 완료";
            case PREPARING: return "제조 중";
            case COMPLETED: return "제공 완료";
            case CANCELLED: return "취소됨";
            default: return status.name();
        }
    }
}
