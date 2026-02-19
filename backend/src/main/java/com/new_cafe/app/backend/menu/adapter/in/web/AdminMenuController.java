package com.new_cafe.app.backend.menu.adapter.in.web;

import com.new_cafe.app.backend.menu.application.port.in.*;
import com.new_cafe.app.backend.category.application.port.in.GetCategoryQuery;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminMenuController {

    private final GetMenuQuery getMenuQuery;
    private final GetMenuImageQuery getMenuImageQuery;
    private final GetCategoryQuery getCategoryQuery;
    private final RegisterMenuUseCase registerMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;

    public AdminMenuController(GetMenuQuery getMenuQuery,
                               GetMenuImageQuery getMenuImageQuery,
                               GetCategoryQuery getCategoryQuery,
                               RegisterMenuUseCase registerMenuUseCase,
                               UpdateMenuUseCase updateMenuUseCase,
                               DeleteMenuUseCase deleteMenuUseCase) {
        this.getMenuQuery = getMenuQuery;
        this.getMenuImageQuery = getMenuImageQuery;
        this.getCategoryQuery = getCategoryQuery;
        this.registerMenuUseCase = registerMenuUseCase;
        this.updateMenuUseCase = updateMenuUseCase;
        this.deleteMenuUseCase = deleteMenuUseCase;
    }

    // ===== 메뉴 조회 API =====

    @GetMapping("/menus")
    public MenuListResponseDto getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {

        List<Menu> menus = getMenuQuery.getMenus(categoryId, searchQuery);

        List<MenuResponseDto> menuDtos = menus.stream().map(menu -> {
            Category category = getCategoryQuery.getCategory(menu.getCategoryId());
            String categoryName = category != null ? category.getName() : "";
            String categoryIcon = category != null ? category.getIcon() : "";

            List<MenuImage> images = getMenuImageQuery.getMenuImages(menu.getId());
            String imageSrc = images.isEmpty() ? "blank.png" : images.get(0).getSrcUrl();

            return MenuResponseDto.builder()
                    .id(menu.getId())
                    .korName(menu.getKorName())
                    .engName(menu.getEngName())
                    .description(menu.getDescription())
                    .price(menu.getPrice())
                    .categoryName(categoryName)
                    .categoryIcon(categoryIcon)
                    .imageSrc(imageSrc)
                    .isAvailable(menu.getIsAvailable())
                    .isSoldOut(menu.getIsSoldOut())
                    .sortOrder(menu.getSortOrder())
                    .createdAt(menu.getCreatedAt())
                    .updatedAt(menu.getUpdatedAt())
                    .build();
        }).toList();

        return MenuListResponseDto.builder()
                .menus(menuDtos)
                .menuCount(menuDtos.size())
                .build();
    }

    @GetMapping("/menus/{id}")
    public MenuDetailResponseDto getMenu(@PathVariable Long id) {
        Menu menu = getMenuQuery.getMenu(id);
        Category category = getCategoryQuery.getCategory(menu.getCategoryId());

        return MenuDetailResponseDto.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(category != null ? category.getName() : "")
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    @GetMapping("/menus/{id}/menu-images")
    public MenuImageListResponseDto getMenuImages(@PathVariable Long id) {
        Menu menu = getMenuQuery.getMenu(id);
        List<MenuImage> images = getMenuImageQuery.getMenuImages(id);

        List<MenuImageResponseDto> imageDtos = images.stream()
                .map(img -> MenuImageResponseDto.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .altText(menu.getKorName())
                        .sortOrder(img.getSortOrder() != null ? img.getSortOrder() : 0)
                        .build())
                .toList();

        return MenuImageListResponseDto.builder()
                .images(imageDtos)
                .build();
    }

    // ===== 메뉴 관리(CUD) API =====

    @PostMapping("/menus")
    @ResponseStatus(HttpStatus.CREATED)
    public Long createMenu(@RequestBody MenuCreateRequestDto request) {
        return registerMenuUseCase.registerMenu(RegisterMenuUseCase.RegisterMenuCommand.builder()
                .korName(request.getKorName())
                .engName(request.getEngName())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .imageSrc(request.getImageSrc())
                .isAvailable(request.getIsAvailable())
                .sortOrder(request.getSortOrder())
                .build());
    }

    @PutMapping("/menus/{id}")
    public void updateMenu(@PathVariable Long id, @RequestBody MenuUpdateRequestDto request) {
        updateMenuUseCase.updateMenu(UpdateMenuUseCase.UpdateMenuCommand.builder()
                .id(id)
                .korName(request.getKorName())
                .engName(request.getEngName())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .imageSrc(request.getImageSrc())
                .isAvailable(request.getIsAvailable())
                .isSoldOut(request.getIsSoldOut())
                .sortOrder(request.getSortOrder())
                .build());
    }

    @DeleteMapping("/menus/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
    }

    // ===== 카테고리 API =====

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return getCategoryQuery.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    public Category getCategory(@PathVariable Long id) {
        return getCategoryQuery.getCategory(id);
    }
}
