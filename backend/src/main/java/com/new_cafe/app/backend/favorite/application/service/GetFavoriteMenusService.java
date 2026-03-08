package com.new_cafe.app.backend.favorite.application.service;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.favorite.application.port.in.GetFavoriteMenusUseCase;
import com.new_cafe.app.backend.favorite.application.port.out.LoadFavoriteListPort;
import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuListResult;
import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuResult;
import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetFavoriteMenusService implements GetFavoriteMenusUseCase {

    private final LoadFavoriteListPort loadFavoriteListPort;
    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;
    private final LoadCategoryPort loadCategoryPort;

    @Override
    public FavoriteMenuListResult getFavoriteMenus(UUID memberId) {
        List<Favorite> favorites = loadFavoriteListPort.findFavoritesByMemberId(memberId);
        List<Category> categories = loadCategoryPort.findAllActive();
        
        List<FavoriteMenuResult> menus = favorites.stream()
                .map(favorite -> loadMenuPort.findAvailableById(favorite.getMenuId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(menu -> {
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

                    return FavoriteMenuResult.builder()
                            .id(menu.getId())
                            .korName(menu.getKorName())
                            .engName(menu.getEngName())
                            .price(menu.getPrice())
                            .description(menu.getDescription())
                            .categoryId(menu.getCategoryId())
                            .categoryName(categoryName)
                            .categoryIcon(categoryIcon)
                            .imageSrc(imageSrc)
                            .isSoldOut(Boolean.TRUE.equals(menu.getIsSoldOut()))
                            .build();
                })
                .collect(Collectors.toList());
                
        return FavoriteMenuListResult.builder().menus(menus).build();
    }
}
