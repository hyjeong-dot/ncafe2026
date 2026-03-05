package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("adminGetMenuService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuService implements GetMenuUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadCategoryPort loadCategoryPort;
    private final MenuImagePort menuImagePort;

    @Override
    public MenuResult getMenu(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 메뉴입니다. ID: " + id));

        AdminCategory category = loadCategoryPort.findById(menu.getCategoryId())
                .orElse(null);

        List<AdminMenuImage> images = menuImagePort.findAllByMenuId(menu.getId());
        String imageSrc = images.isEmpty() ? "blank.png" : images.get(0).getSrcUrl();
        
        List<com.new_cafe.app.backend.admin.menu.application.result.MenuImageResult> imageResults = images.stream()
                .map(img -> com.new_cafe.app.backend.admin.menu.application.result.MenuImageResult.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        return MenuResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(category != null ? category.getName() : "알 수 없음")
                .categoryIcon(category != null ? category.getIcon() : "")
                .imageSrc(imageSrc)
                .images(imageResults)
                .isAvailable(menu.getIsAvailable())
                .isSoldOut(menu.getIsSoldOut())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
