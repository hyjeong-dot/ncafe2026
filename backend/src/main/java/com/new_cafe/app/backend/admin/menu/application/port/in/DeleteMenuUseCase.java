package com.new_cafe.app.backend.admin.menu.application.port.in;

/**
 * 메뉴 삭제 유즈케이스 (관리자 전용)
 */
public interface DeleteMenuUseCase {
    void deleteMenu(Long id);
}
