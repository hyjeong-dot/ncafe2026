package com.new_cafe.app.backend.admin.dashboard.adapter.in.web;

import com.new_cafe.app.backend.admin.dashboard.application.port.in.GetAdminDashboardStatsUseCase;
import com.new_cafe.app.backend.admin.dashboard.application.result.AdminDashboardStatsResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final GetAdminDashboardStatsUseCase getAdminDashboardStatsUseCase;

    @GetMapping("/stats")
    public AdminDashboardStatsResult getStats() {
        return getAdminDashboardStatsUseCase.getStats();
    }
}
