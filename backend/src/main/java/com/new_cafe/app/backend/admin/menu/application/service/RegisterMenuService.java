package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.RegisterMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
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

    private final SaveMenuPort saveMenuPort;

    @Override
    public Long registerMenu(RegisterMenuCommand command) {
        Menu menu = Menu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.getIsAvailable())
                .sortOrder(command.getSortOrder())
                .build();

        return saveMenuPort.save(menu);
    }
}
