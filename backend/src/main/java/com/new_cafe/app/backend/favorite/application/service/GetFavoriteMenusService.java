package com.new_cafe.app.backend.favorite.application.service;

import com.new_cafe.app.backend.favorite.application.port.in.GetFavoriteMenusUseCase;
import com.new_cafe.app.backend.favorite.application.port.out.LoadFavoriteListPort;
import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuListResult;
import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuResult;
import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
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

    @Override
    public FavoriteMenuListResult getFavoriteMenus(UUID memberId) {
        List<Favorite> favorites = loadFavoriteListPort.findFavoritesByMemberId(memberId);
        
        List<FavoriteMenuResult> menus = favorites.stream()
                .map(favorite -> loadMenuPort.findAvailableById(favorite.getMenuId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(menu -> FavoriteMenuResult.builder()
                        .id(menu.getId())
                        .korName(menu.getKorName())
                        .engName(menu.getEngName())
                        .price(menu.getPrice())
                        .description(menu.getDescription())
                        .categoryId(menu.getCategoryId())
                        .build())
                .collect(Collectors.toList());
                
        return FavoriteMenuListResult.builder().menus(menus).build();
    }
}
