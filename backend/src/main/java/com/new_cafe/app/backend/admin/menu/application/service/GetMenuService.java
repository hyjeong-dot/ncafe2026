package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuOptionPort;
import com.new_cafe.app.backend.admin.menu.application.result.MenuImageResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuOptionResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.application.result.OptionItemResult;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service("adminGetMenuService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuService implements GetMenuUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadCategoryPort loadCategoryPort;
    private final MenuImagePort menuImagePort;
    private final MenuOptionPort menuOptionPort;

    @Override
    public MenuResult getMenu(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 메뉴입니다. ID: " + id));

        AdminCategory category = loadCategoryPort.findById(menu.getCategoryId())
                .orElse(null);

        // 이미지 조회
        List<AdminMenuImage> images = menuImagePort.findAllByMenuId(menu.getId());
        String imageSrc = images.isEmpty() ? "blank.png" : images.get(0).getSrcUrl();
        
        List<MenuImageResult> imageResults = images.stream()
                .map(img -> MenuImageResult.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        // 옵션 조회
        List<MenuOption> options = menuOptionPort.findAllByMenuId(menu.getId());
        List<MenuOptionResult> optionResults = options.stream()
                .map(opt -> {
                    List<OptionItem> items = menuOptionPort.findAllByOptionId(opt.getId());
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
                .options(optionResults)
                .isAvailable(menu.getIsAvailable())
                .isSoldOut(menu.getIsSoldOut())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
