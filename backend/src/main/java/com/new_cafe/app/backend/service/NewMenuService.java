package com.new_cafe.app.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.new_cafe.app.backend.dto.*;
import com.new_cafe.app.backend.entity.Menu;
// import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.entity.MenuImage;
import com.new_cafe.app.backend.repository.CategoryRepository;
import com.new_cafe.app.backend.repository.MenuRepository;
import com.new_cafe.app.backend.repository.MenuImageRepository;

@Service // new MenuService를 대신 사용
public class NewMenuService implements MenuService {

    private CategoryRepository categoryRepository;
    private MenuRepository menuRepository;
    private MenuImageRepository menuImageRepository;

    public NewMenuService(CategoryRepository categoryRepository, MenuRepository menuRepository,
            MenuImageRepository menuImageRepository) {
        this.categoryRepository = categoryRepository;
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public MenuListResponse getMenus(MenuListRequest request) {
        Long categoryId = request.getCategoryId();
        String searchQuery = request.getSearchQuery();

        List<Menu> menus = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);

        List<MenuResponse> menuResponses = menus.stream().map(menu -> {
            String categoryName = categoryRepository.findById(menu.getCategoryId()).getName();

            List<MenuImage> images = menuImageRepository.findAllByMenuId(menu.getId());
            // primary image or first image or default image
            String imageSrc = "";
            // images의 갯수가 0인 경우는 blank image를 사용한다.
            if (!images.isEmpty()) {
                imageSrc = images.get(0).getSrcUrl();
            } else {
                imageSrc = "blank.png";
            }
            // String imageSrc = images.isEmpty() ? "images/blank.png" :
            // images.get(0).getSrcUrl();
            return MenuResponse.builder()
                    .id(menu.getId())
                    .korName(menu.getKorName())
                    .engName(menu.getEngName())
                    .description(menu.getDescription())
                    .price(menu.getPrice())
                    .categoryName(categoryName)
                    .imageSrc(imageSrc)
                    .isAvailable(menu.getIsAvailable())
                    .isSoldOut(menu.getIsSoldOut())
                    .sortOrder(menu.getSortOrder())
                    .createdAt(menu.getCreatedAt() != null ? menu.getCreatedAt().toLocalDateTime() : null)
                    .updatedAt(menu.getUpdatedAt() != null ? menu.getUpdatedAt().toLocalDateTime() : null)
                    .build();
        }).toList();
        return MenuListResponse.builder()
                .menus(menuResponses)
                .menuCount(menuResponses.size())
                .build();
    }

    @Override
    public MenuDetailResponse getMenu(Long id) {
        Menu menu = menuRepository.findById(id);
        if (menu == null) {
            return null;
        }

        // List<MenuImage> menuImages =
        // menuImageRepository.findAllByMenuId(menu.getId());
        // List<String> imageUrls = menuImages.stream()
        // .map(MenuImage::getSrcUrl)
        // .toList();

        return MenuDetailResponse.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(categoryRepository.findById(menu.getCategoryId()).getName())
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt() != null ? menu.getCreatedAt().toLocalDateTime() : null)
                .updatedAt(menu.getUpdatedAt() != null ? menu.getUpdatedAt().toLocalDateTime() : null)
                .build();
    }

    @Override
    public MenuImageListResponse getMenuImages(Long id) {
        Menu menu = menuRepository.findById(id);
        if (menu == null) {
            return null;
        }

        List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(menu.getId());
        String altText = menu.getKorName(); // 부모 테이블인 Menu에서 가져옴

        List<MenuImageResponse> imageItems = menuImages.stream()
                .map(img -> MenuImageResponse.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .altText(altText)
                        .sortOrder(img.getSortOrder() != null ? img.getSortOrder() : 0)
                        .build())
                .toList();

        return MenuImageListResponse.builder()
                .images(imageItems)
                .build();
    }

    @Override
    public MenuCreateResponse createMenu(MenuCreateRequest request) {
        return null;
    }

    @Override
    public void deleteMenu(Long id) {
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        return null;
    }

}
