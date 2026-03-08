package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuDetailUseCase;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.result.MenuDetailResult;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuDetailService implements GetMenuDetailUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;
    private final LoadCategoryPort loadCategoryPort;

    @Override
    public MenuDetailResult getAvailableMenu(Long id) {
        Menu menu = loadMenuPort.findAvailableById(id)
                .orElseThrow(() -> new MenuNotFoundException(id));

        List<Category> categories = loadCategoryPort.findAllActive();
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

        return MenuDetailResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(categoryName)
                .categoryIcon(categoryIcon)
                .imageSrc(imageSrc)
                .isSoldOut(menu.getIsSoldOut())
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
