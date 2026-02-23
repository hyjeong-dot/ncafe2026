package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
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
@Service("adminGetMenuListService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuListService implements GetMenuListUseCase {

    private final LoadMenuPort loadMenuPort;
    private final MenuImagePort menuImagePort;
    private final LoadCategoryPort loadCategoryPort;

    @Override
    public MenuListResult getMenus(Long categoryId, String searchQuery) {
        List<Menu> menus = loadMenuPort.findAll(categoryId, searchQuery);
        List<AdminCategory> categories = loadCategoryPort.findAll();

        List<MenuResult> menuResults = menus.stream()
                .map(menu -> {
                    // 카테고리 정보 매핑
                    AdminCategory category = categories.stream()
                            .filter(c -> c.getId().equals(menu.getCategoryId()))
                            .findFirst()
                            .orElse(null);

                    // 이미지 경로 매핑 (첫 번째 이미지)
                    List<AdminMenuImage> images = menuImagePort.findAllByMenuId(menu.getId());
                    String imageSrc = images.isEmpty() ? "blank.png" : images.get(0).getSrcUrl();

                    return MenuResult.builder()
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
                        .categoryName(category != null ? category.getName() : "알 수 없음")
                        .categoryIcon(category != null ? category.getIcon() : "")
                        .imageSrc(imageSrc)
                        .build();
                })
                .collect(Collectors.toList());

        return MenuListResult.builder()
                .menus(menuResults)
                .menuCount(menuResults.size())
                .build();
    }
}
