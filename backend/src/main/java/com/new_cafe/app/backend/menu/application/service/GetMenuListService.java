package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.menu.application.result.MenuResult;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service("publicGetMenuListService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuListService implements GetMenuListUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;
    private final LoadCategoryPort loadCategoryPort;

    @Override
    public MenuListResult getAvailableMenus(Long categoryId) {
        List<Menu> menus = (categoryId != null)
                ? loadMenuPort.findAllAvailableByCategoryId(categoryId)
                : loadMenuPort.findAllAvailable();

        List<Category> categories = loadCategoryPort.findAllActive();

        List<MenuResult> results = menus.stream().map(menu -> {
            // 카테고리 정보 매핑
            String categoryName = "";
            String categoryIcon = "";
            for (Category cat : categories) {
                if (cat.getId().equals(menu.getCategoryId())) {
                    categoryName = cat.getName();
                    categoryIcon = cat.getIcon();
                    break;
                }
            }

            // 이미지 (첫 번째)
            List<MenuImage> images = loadMenuImagePort.findAllByMenuId(menu.getId());
            String imageSrc = images.isEmpty() ? "blank.png" : images.get(0).getSrcUrl();

            return MenuResult.builder()
                    .id(menu.getId())
                    .korName(menu.getKorName())
                    .engName(menu.getEngName())
                    .description(menu.getDescription())
                    .price(menu.getPrice())
                    .categoryName(categoryName)
                    .categoryIcon(categoryIcon)
                    .imageSrc(imageSrc)
                    .isSoldOut(menu.getIsSoldOut())
                    .build();
        }).collect(Collectors.toList());

        return MenuListResult.builder()
                .menus(results)
                .menuCount(results.size())
                .build();
    }
}
