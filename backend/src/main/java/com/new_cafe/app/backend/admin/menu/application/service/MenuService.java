package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.RegisterMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.ManageMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 메뉴 관리 서비스 (관리자 전용)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MenuService implements ManageMenuUseCase {

    private final MenuPort menuPort;

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

        return menuPort.save(menu);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuListResult getMenus(Long categoryId, String searchQuery) {
        List<Menu> menus = menuPort.findAll(categoryId, searchQuery);

        List<MenuResult> menuResults = menus.stream()
                .map(menu -> MenuResult.builder()
                        .id(menu.getId())
                        .korName(menu.getKorName())
                        .engName(menu.getEngName())
                        .description(menu.getDescription())
                        .price(menu.getPrice())
                        .isAvailable(menu.getIsAvailable())
                        .isSoldOut(menu.getIsSoldOut())
                        .sortOrder(menu.getSortOrder())
                        .createdAt(menu.getCreatedAt())
                        .updatedAt(menu.getUpdatedAt())
                        // 기획대로 Category와 Image 조합 로직은 별도 포트 주입 후 완성
                        .categoryName("미구현")
                        .categoryIcon("")
                        .imageSrc("blank.png")
                        .build())
                .collect(Collectors.toList());

        return MenuListResult.builder()
                .menus(menuResults)
                .menuCount(menuResults.size())
                .build();
    }

    @Override
    public void updateMenu(UpdateMenuCommand command) {
        Menu menu = menuPort.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + command.getId()));

        menu.setKorName(command.getKorName());
        menu.setEngName(command.getEngName());
        menu.setDescription(command.getDescription());
        menu.setPrice(command.getPrice());
        menu.setCategoryId(command.getCategoryId());
        menu.setIsAvailable(command.getIsAvailable());
        menu.setIsSoldOut(command.getIsSoldOut());
        menu.setSortOrder(command.getSortOrder());

        menuPort.save(menu);
    }

    @Override
    public void deleteMenu(Long id) {
        menuPort.deleteById(id);
    }
}
