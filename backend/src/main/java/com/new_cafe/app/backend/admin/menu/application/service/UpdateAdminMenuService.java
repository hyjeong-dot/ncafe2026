package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateAdminMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateAdminMenuService implements UpdateAdminMenuUseCase {

    private final LoadAdminMenuPort loadAdminMenuPort;
    private final SaveAdminMenuPort saveAdminMenuPort;

    @Override
    public void updateMenu(UpdateAdminMenuCommand command) {
        AdminMenu menu = loadAdminMenuPort.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + command.getId()));

        menu.setKorName(command.getKorName());
        menu.setEngName(command.getEngName());
        menu.setDescription(command.getDescription());
        menu.setPrice(command.getPrice());
        menu.setCategoryId(command.getCategoryId());
        menu.setIsAvailable(command.getIsAvailable());
        menu.setIsSoldOut(command.getIsSoldOut());
        menu.setSortOrder(command.getSortOrder());

        saveAdminMenuPort.saveAdminMenu(menu);
    }
}
