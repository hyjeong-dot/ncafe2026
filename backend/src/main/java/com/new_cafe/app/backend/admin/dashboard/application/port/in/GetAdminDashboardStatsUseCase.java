package com.new_cafe.app.backend.admin.dashboard.application.port.in;

import com.new_cafe.app.backend.admin.dashboard.application.result.AdminDashboardStatsResult;

public interface GetAdminDashboardStatsUseCase {
    AdminDashboardStatsResult getStats();
}
