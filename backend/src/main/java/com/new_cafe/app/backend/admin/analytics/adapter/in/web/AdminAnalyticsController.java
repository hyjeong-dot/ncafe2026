package com.new_cafe.app.backend.admin.analytics.adapter.in.web;

import com.new_cafe.app.backend.admin.analytics.application.service.AnalyticsService;
import com.new_cafe.app.backend.admin.analytics.application.result.SalesAnalyticsResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/sales")
    public SalesAnalyticsResult getSalesAnalytics(@RequestParam(defaultValue = "7") int days) {
        return analyticsService.getSalesAnalytics(days);
    }
}
