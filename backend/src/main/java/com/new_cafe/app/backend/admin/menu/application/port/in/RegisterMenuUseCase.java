package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import lombok.Builder;
import lombok.Getter;

/**
 * 메뉴 등록 유즈케이스 (관리자 전용)
 */
public interface RegisterMenuUseCase {
    Long registerMenu(RegisterMenuCommand command);
}
