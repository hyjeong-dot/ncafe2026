package com.new_cafe.app.backend.admin.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AdminMenuListResponse {
    private final List<AdminMenuResponse> menus;
    private final int menuCount;
}
