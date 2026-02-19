package com.new_cafe.app.backend.menu.adapter.in.web;

import com.new_cafe.app.backend.menu.application.port.in.GetPublicMenuQuery;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuImageQuery;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 회원용 메뉴 조회 컨트롤러 (Input Adapter)
 * - 회원(고객)이 카페 메뉴를 볼 때 사용하는 API입니다.
 * - 관리자용(AdminMenuController)과 다르게, 판매 가능한 메뉴만 노출합니다.
 * - URL 경로: /api/menus (관리자: /admin/menus)
 */
@RestController
@RequestMapping("/api/menus")
public class PublicMenuController {

    private final GetPublicMenuQuery getPublicMenuQuery;
    private final GetMenuImageQuery getMenuImageQuery;

    public PublicMenuController(GetPublicMenuQuery getPublicMenuQuery,
                                GetMenuImageQuery getMenuImageQuery) {
        this.getPublicMenuQuery = getPublicMenuQuery;
        this.getMenuImageQuery = getMenuImageQuery;
    }

    /**
     * GET /api/menus?categoryId=1
     * 판매 가능한 메뉴 목록 조회 (카테고리 필터)
     */
    @GetMapping
    public MenuListResponseDto getMenus(
            @RequestParam(required = false) Long categoryId) {

        List<Menu> menus = getPublicMenuQuery.getAvailableMenus(categoryId);
        List<Category> categories = getPublicMenuQuery.getCategories();

        List<MenuResponseDto> menuDtos = menus.stream().map(menu -> {
            // 카테고리 정보
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
                    .isSoldOut(menu.getIsSoldOut())
                    .build();
        }).toList();

        return MenuListResponseDto.builder()
                .menus(menuDtos)
                .menuCount(menuDtos.size())
                .build();
    }

    /**
     * GET /api/menus/{id}
     * 판매 가능한 메뉴 상세 조회
     */
    @GetMapping("/{id}")
    public MenuDetailResponseDto getMenu(@PathVariable Long id) {
        Menu menu = getPublicMenuQuery.getAvailableMenu(id);
        List<Category> categories = getPublicMenuQuery.getCategories();

        String categoryName = "";
        for (Category cat : categories) {
            if (cat.getId().equals(menu.getCategoryId())) {
                categoryName = cat.getName();
                break;
            }
        }

        return MenuDetailResponseDto.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(categoryName)
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    /**
     * GET /api/menus/{id}/images
     * 메뉴 이미지 목록 조회
     */
    @GetMapping("/{id}/images")
    public MenuImageListResponseDto getMenuImages(@PathVariable Long id) {
        Menu menu = getPublicMenuQuery.getAvailableMenu(id);
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

    /**
     * GET /api/menus/categories
     * 카테고리 목록 조회
     */
    @GetMapping("/categories")
    public List<Category> getCategories() {
        return getPublicMenuQuery.getCategories();
    }
}
