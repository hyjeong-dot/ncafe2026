package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 메뉴 목록 조회 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuListService implements GetMenuListUseCase {

    private final LoadMenuPort loadMenuPort;

    @Override
    public MenuListResult getMenus(Long categoryId, String searchQuery) {
        List<Menu> menus = loadMenuPort.findAll(categoryId, searchQuery);

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
}
