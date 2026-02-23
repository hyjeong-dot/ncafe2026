package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.application.result.MenuListResult;

/**
 * 사용자용 메뉴 목록 조회 유스케이스
 * - 판매 가능한(isAvailable=true) 메뉴만 반환
 */
public interface GetMenuListUseCase {
    MenuListResult getAvailableMenus(Long categoryId);
}
