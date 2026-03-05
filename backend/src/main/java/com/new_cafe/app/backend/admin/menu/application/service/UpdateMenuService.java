package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메뉴 수정 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UpdateMenuService implements UpdateMenuUseCase {

    private final LoadMenuPort loadMenuPort;
    private final SaveMenuPort saveMenuPort;

    @Override
    public void updateMenu(UpdateMenuCommand command) {
        Menu menu = loadMenuPort.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + command.getId()));

        menu.setKorName(command.getKorName());
        menu.setEngName(command.getEngName());
        menu.setDescription(command.getDescription());
        menu.setPrice(command.getPrice());
        menu.setCategoryId(command.getCategoryId());
        menu.setIsAvailable(command.getIsAvailable());
        menu.setIsSoldOut(command.getIsSoldOut());
        menu.setSortOrder(command.getSortOrder());

        saveMenuPort.save(menu);
    }

    @Override
    public void toggleSoldOut(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + id));
        menu.setIsSoldOut(!menu.getIsSoldOut());
        saveMenuPort.save(menu);
    }
}
