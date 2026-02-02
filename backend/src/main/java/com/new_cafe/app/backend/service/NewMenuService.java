package com.new_cafe.app.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.new_cafe.app.backend.dto.*;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.repository.MenuRepository;

@Service // new MenuService를 대신 사용
public class NewMenuService implements MenuService {

    private MenuRepository menuRepository;

    public NewMenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Override
    public MenuListResponse getMenus(MenuListRequest request) {
        Integer categoryId = request.getCategoryId();
        String searchQuery = request.getSearchQuery();

        List<Menu> menus = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);

        List<MenuResponse> menuResponses = menus.stream().map(menu -> MenuResponse.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryName(menu.getCategory() != null ? menu.getCategory().getName() : "기타")
                .imageSrc(menu.getImage())
                .isAvailable(menu.getIsAvailable())
                .isSoldOut(menu.getIsSoldOut())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt() != null ? menu.getCreatedAt().toLocalDateTime() : null)
                .updatedAt(menu.getUpdatedAt() != null ? menu.getUpdatedAt().toLocalDateTime() : null)
                .build()).toList();

        return MenuListResponse.builder()
                .menus(menuResponses)
                .menuCount(menuResponses.size())
                .build();
    }

    @Override
    public MenuDetailResponse getMenu(String id) {
        return null;
    }

    @Override
    public MenuCreateResponse createMenu(MenuCreateRequest request) {
        return null;
    }

    @Override
    public void deleteMenu(String id) {
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        return null;
    }
}
