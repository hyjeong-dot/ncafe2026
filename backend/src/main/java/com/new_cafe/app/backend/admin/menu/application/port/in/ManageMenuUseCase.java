package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.RegisterMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;

/**
 * 메뉴 관리 유즈케이스 (관리자 전용)
 * - 메뉴 등록, 조회, 수정, 삭제를 통합 관리합니다.
 */
public interface ManageMenuUseCase {
    Long registerMenu(RegisterMenuCommand command);
    MenuListResult getMenus(Long categoryId, String searchQuery);
    void updateMenu(UpdateMenuCommand command);
    void deleteMenu(Long id);
}
