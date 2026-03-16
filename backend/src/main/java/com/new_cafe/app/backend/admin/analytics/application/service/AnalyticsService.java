package com.new_cafe.app.backend.admin.analytics.application.service;

import com.new_cafe.app.backend.admin.analytics.application.result.SalesAnalyticsResult;
import com.new_cafe.app.backend.admin.analytics.application.result.SalesAnalyticsResult.*;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.AdminMenuJpaRepository;
import com.new_cafe.app.backend.order.adapter.out.persistence.repository.OrderRepository;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final AdminMenuJpaRepository menuRepository;

    public SalesAnalyticsResult getSalesAnalytics(int days) {
        List<Order> allOrders;

        if (days <= 0) {
            allOrders = orderRepository.findAll();
        } else {
            LocalDateTime since = LocalDateTime.now().minusDays(days);
            allOrders = orderRepository.findAllByCreatedAtAfter(since);
        }

        // 취소 제외 유효 주문
        List<Order> validOrders = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED && o.getStatus() != OrderStatus.PENDING)
                .collect(Collectors.toList());

        long cancelledOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .count();

        long totalRevenue = validOrders.stream().mapToLong(Order::getTotalPrice).sum();
        long totalOrders = validOrders.size();

        int periodDays = days <= 0 ? Math.max(1, calculateTotalDays(allOrders)) : days;
        long dailyAvg = totalOrders > 0 ? totalRevenue / periodDays : 0;

        double cancelRate = allOrders.isEmpty() ? 0 :
                Math.round(cancelledOrders * 1000.0 / allOrders.size()) / 10.0;

        // 일별 데이터
        List<DailyData> dailyData = buildDailyData(validOrders, days);

        // 인기 메뉴 Top 5
        List<PopularMenu> popularMenus = buildPopularMenus(validOrders);

        // 시간대별 분포
        List<HourlyData> hourlyDistribution = buildHourlyDistribution(validOrders);

        return SalesAnalyticsResult.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .cancelledOrders(cancelledOrders)
                .cancelRate(cancelRate)
                .dailyAverageRevenue(dailyAvg)
                .dailyData(dailyData)
                .popularMenus(popularMenus)
                .hourlyDistribution(hourlyDistribution)
                .build();
    }

    private int calculateTotalDays(List<Order> orders) {
        if (orders.isEmpty()) return 1;
        LocalDate earliest = orders.stream()
                .map(o -> o.getCreatedAt().toLocalDate())
                .min(Comparator.naturalOrder())
                .orElse(LocalDate.now());
        return (int) java.time.temporal.ChronoUnit.DAYS.between(earliest, LocalDate.now()) + 1;
    }

    private List<DailyData> buildDailyData(List<Order> orders, int days) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, long[]> map = new LinkedHashMap<>();

        // 날짜 슬롯 초기화
        int range = days <= 0 ? calculateTotalDays(orders) : days;
        for (int i = range - 1; i >= 0; i--) {
            String key = LocalDate.now().minusDays(i).format(fmt);
            map.put(key, new long[]{0, 0}); // [revenue, count]
        }

        for (Order o : orders) {
            String key = o.getCreatedAt().toLocalDate().format(fmt);
            long[] val = map.get(key);
            if (val != null) {
                val[0] += o.getTotalPrice();
                val[1]++;
            }
        }

        return map.entrySet().stream()
                .map(e -> DailyData.builder()
                        .date(e.getKey())
                        .revenue(e.getValue()[0])
                        .orderCount(e.getValue()[1])
                        .build())
                .collect(Collectors.toList());
    }

    private List<PopularMenu> buildPopularMenus(List<Order> orders) {
        Map<Long, long[]> menuStats = new HashMap<>(); // menuId -> [qty, revenue]

        orders.forEach(order -> order.getItems().forEach(item -> {
            menuStats.computeIfAbsent(item.getMenuId(), k -> new long[]{0, 0});
            long[] val = menuStats.get(item.getMenuId());
            val[0] += item.getQuantity();
            val[1] += (long) item.getPrice() * item.getQuantity();
        }));

        return menuStats.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue()[0], a.getValue()[0]))
                .limit(5)
                .map(e -> {
                    String menuName = menuRepository.findById(e.getKey())
                            .map(m -> m.getKorName())
                            .orElse("삭제된 메뉴");
                    return PopularMenu.builder()
                            .menuName(menuName)
                            .totalQuantity(e.getValue()[0])
                            .totalRevenue(e.getValue()[1])
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<HourlyData> buildHourlyDistribution(List<Order> orders) {
        long[] hourCounts = new long[24];
        orders.forEach(o -> hourCounts[o.getCreatedAt().getHour()]++);

        List<HourlyData> result = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            result.add(HourlyData.builder().hour(h).orderCount(hourCounts[h]).build());
        }
        return result;
    }
}
