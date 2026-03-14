package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuDetailUseCase;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuOptionPort;
import com.new_cafe.app.backend.menu.application.result.MenuDetailResult;
import com.new_cafe.app.backend.menu.application.result.MenuOptionResult;
import com.new_cafe.app.backend.menu.application.result.OptionItemResult;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuDetailService implements GetMenuDetailUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;
    private final LoadCategoryPort loadCategoryPort;
    private final LoadMenuOptionPort loadMenuOptionPort;

    @Override
    public MenuDetailResult getAvailableMenu(Long id) {
        Menu menu = loadMenuPort.findAvailableById(id)
                .orElseThrow(() -> new MenuNotFoundException(id));
        return buildMenuDetailResult(menu);
    }

    @Override
    public MenuDetailResult getAvailableMenuBySlug(String slug) {
        Menu menu = loadMenuPort.findAvailableBySlug(slug)
                .orElseThrow(() -> new MenuNotFoundException(slug));
        return buildMenuDetailResult(menu);
    }

    private MenuDetailResult buildMenuDetailResult(Menu menu) {
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

        // 옵션 조회
        List<MenuOption> options = loadMenuOptionPort.findAllByMenuId(menu.getId());
        List<MenuOptionResult> optionResults = options.stream()
                .map(opt -> {
                    List<OptionItem> items = loadMenuOptionPort.findAllByOptionId(opt.getId());
                    List<OptionItemResult> itemResults = items.stream()
                            .map(item -> OptionItemResult.builder()
                                    .id(item.getId())
                                    .optionId(item.getOptionId())
                                    .name(item.getName())
                                    .priceDelta(item.getPriceDelta())
                                    .sortOrder(item.getSortOrder())
                                    .build())
                            .collect(Collectors.toList());

                    return MenuOptionResult.builder()
                            .id(opt.getId())
                            .menuId(opt.getMenuId())
                            .name(opt.getName())
                            .isRequired(opt.getIsRequired())
                            .isMultiSelect(opt.getIsMultiSelect())
                            .sortOrder(opt.getSortOrder())
                            .items(itemResults)
                            .build();
                })
                .collect(Collectors.toList());

        return MenuDetailResult.builder()
                .id(menu.getId())
                .slug(menu.getSlug())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(categoryName)
                .categoryIcon(categoryIcon)
                .imageSrc(imageSrc)
                .isSoldOut(menu.getIsSoldOut())
                .isAvailable(menu.getIsAvailable())
                .options(optionResults)
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
