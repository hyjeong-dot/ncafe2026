package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.order.application.port.in.GetMyOrdersUseCase;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.application.result.OrderResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMyOrdersService implements GetMyOrdersUseCase {

    private final OrderPort orderPort;
    private final LoadMemberPort loadMemberPort;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResult> getMyOrders(String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        return orderPort.findAllByMemberIdOrderByCreatedAtDesc(member.getId()).stream()
                .map(order -> OrderResult.builder()
                        .orderId(order.getId())
                        .orderUid(order.getOrderUid())
                        .totalPrice(order.getTotalPrice())
                        .orderType(order.getOrderType())
                        .status(order.getStatus())
                        .createdAt(order.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
