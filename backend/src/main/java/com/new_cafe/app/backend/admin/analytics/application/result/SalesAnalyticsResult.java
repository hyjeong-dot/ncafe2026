package com.new_cafe.app.backend.admin.analytics.application.result;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SalesAnalyticsResult {

    // 요약
    private final long totalRevenue;
    private final long totalOrders;
    private final long cancelledOrders;
    private final double cancelRate; // %
    private final long dailyAverageRevenue;

    // 일별 매출/주문
    private final List<DailyData> dailyData;

    // 인기 메뉴 Top 5
    private final List<PopularMenu> popularMenus;

    // 시간대별 주문 분포 (0~23시)
    private final List<HourlyData> hourlyDistribution;

    @Getter
    @Builder
    public static class DailyData {
        private final String date; // yyyy-MM-dd
        private final long revenue;
        private final long orderCount;
    }

    @Getter
    @Builder
    public static class PopularMenu {
        private final String menuName;
        private final long totalQuantity;
        private final long totalRevenue;
    }

    @Getter
    @Builder
    public static class HourlyData {
        private final int hour; // 0~23
        private final long orderCount;
    }
}
