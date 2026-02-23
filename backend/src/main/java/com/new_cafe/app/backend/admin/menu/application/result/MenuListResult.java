package com.new_cafe.app.backend.admin.menu.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class MenuListResult {
    private final List<MenuResult> menus;
    private final int menuCount;
}
