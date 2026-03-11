package com.new_cafe.app.backend.admin.dashboard.application.service;

import com.new_cafe.app.backend.admin.dashboard.application.port.in.GetAdminDashboardStatsUseCase;
import com.new_cafe.app.backend.admin.dashboard.application.result.AdminDashboardStatsResult;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.AdminMenuJpaRepository;
import com.new_cafe.app.backend.order.adapter.out.persistence.repository.OrderRepository;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.member.adapter.out.persistence.MemberJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAdminDashboardStatsService implements GetAdminDashboardStatsUseCase {

    private final AdminMenuJpaRepository menuRepository;
    private final OrderRepository orderRepository;
    private final MemberJpaRepository memberRepository;

    @Override
    public AdminDashboardStatsResult getStats() {
        LocalDateTime todayStart = LocalDateTime.now().with(LocalTime.MIN);

        long totalMenus = menuRepository.count();
        
        List<Order> todayOrdersList = orderRepository.findAllByCreatedAtAfter(todayStart);
        long todayOrders = todayOrdersList.size();
        long todaySales = todayOrdersList.stream()
                .mapToLong(Order::getTotalPrice)
                .sum();
        
        long todayVisits = memberRepository.countByCreatedAtAfter(todayStart);

        return AdminDashboardStatsResult.builder()
                .totalMenus(totalMenus)
                .todayOrders(todayOrders)
                .todaySales(todaySales)
                .todayVisits(todayVisits)
                .build();
    }
}
