package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;

/**
 * 메뉴 목록 조회 유즈케이스 (관리자 전용)
 */
public interface GetMenuListUseCase {
    MenuListResult getMenus(Long categoryId, String searchQuery);
}
