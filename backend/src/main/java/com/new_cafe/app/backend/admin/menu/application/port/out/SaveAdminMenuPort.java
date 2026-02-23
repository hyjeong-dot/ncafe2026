package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;

/**
 * 메뉴 저장 포트 (영속성 계층 호출 인터페이스)
 */
public interface SaveAdminMenuPort {
    Long saveAdminMenu(AdminMenu menu);
}
