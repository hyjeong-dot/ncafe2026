package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메뉴 등록 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RegisterMenuService implements RegisterMenuUseCase {

    private final SaveAdminMenuPort saveAdminMenuPort;

    @Override
    public Long registerMenu(RegisterMenuCommand command) {
        // 1. Command를 Domain Entity로 변환 (비즈니스 규칙 적용 가능)
        AdminMenu menu = AdminMenu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.getIsAvailable())
                .sortOrder(command.getSortOrder())
                .build();

        // 2. 영속성 계층(Port)을 통해 저장
        return saveAdminMenuPort.saveAdminMenu(menu);
    }
}
