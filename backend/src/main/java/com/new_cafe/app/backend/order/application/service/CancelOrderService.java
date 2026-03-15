package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.coupon.application.service.CouponService;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.order.application.port.in.CancelOrderUseCase;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CancelOrderService implements CancelOrderUseCase {

    private final OrderPort orderPort;
    private final LoadMemberPort loadMemberPort;
    private final CouponService couponService;

    @Override
    @Transactional
    public void cancelOrder(Long orderId, String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Order order = orderPort.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getMemberId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 주문만 취소할 수 있습니다.");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PAID) {
            throw new IllegalStateException("결제 대기 또는 결제 완료 상태에서만 취소할 수 있습니다.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderPort.saveOrder(order);

        // 스탬프 차감
        try {
            couponService.removeStamp(member.getId());
            log.info("Stamp removed for cancelled order {} by user {}", orderId, username);
        } catch (Exception e) {
            log.warn("Stamp removal failed for order {}: {}", orderId, e.getMessage());
        }
    }
}
