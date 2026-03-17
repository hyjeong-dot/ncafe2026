package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.menu.adapter.out.persistence.MenuJpaRepository;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.order.application.port.in.GetMyOrdersUseCase;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.application.result.OrderLineItemResult;
import com.new_cafe.app.backend.order.application.result.OrderResult;
import com.new_cafe.app.backend.order.domain.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMyOrdersService implements GetMyOrdersUseCase {

    private final OrderPort orderPort;
    private final LoadMemberPort loadMemberPort;
    private final MenuJpaRepository menuJpaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResult> getMyOrders(String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        List<Order> orders = orderPort.findAllByMemberIdOrderByCreatedAtDesc(member.getId());

        // 모든 주문의 메뉴 ID를 모아서 한번에 조회 (N+1 방지)
        Set<Long> menuIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(item -> item.getMenuId())
                .collect(Collectors.toSet());

        Map<Long, Menu> menuMap = menuJpaRepository.findAllById(menuIds).stream()
                .collect(Collectors.toMap(Menu::getId, m -> m));

        return orders.stream()
                .map(order -> {
                    List<OrderLineItemResult> itemResults = order.getItems().stream()
                            .map(item -> {
                                Menu menu = menuMap.get(item.getMenuId());
                                return OrderLineItemResult.builder()
                                        .menuId(item.getMenuId())
                                        .menuName(menu != null ? menu.getKorName() : "삭제된 메뉴")
                                        .price(item.getPrice())
                                        .quantity(item.getQuantity())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return OrderResult.builder()
                            .orderId(order.getId())
                            .orderUid(order.getOrderUid())
                            .totalPrice(order.getTotalPrice())
                            .orderType(order.getOrderType())
                            .status(order.getStatus())
                            .createdAt(order.getCreatedAt())
                            .items(itemResults)
                            .requestMemo(order.getRequestMemo())
                            .build();
                })
                .collect(Collectors.toList());
    }
}

