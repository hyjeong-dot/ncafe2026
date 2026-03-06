package com.new_cafe.app.backend.favorite.application.service;

import com.new_cafe.app.backend.favorite.application.port.in.ManageFavoriteUseCase;
import com.new_cafe.app.backend.favorite.application.port.out.FavoritePersistencePort;
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
public class ManageFavoriteService implements ManageFavoriteUseCase {

    private final FavoritePersistencePort favoritePersistencePort;
    private final LoadMenuPort loadMenuPort;

    @Override
    @Transactional
    public boolean toggleFavorite(UUID memberId, Long menuId) {
        Optional<Favorite> existing = favoritePersistencePort.findByMemberIdAndMenuId(memberId, menuId);
        
        if (existing.isPresent()) {
            favoritePersistencePort.delete(existing.get());
            return false;
        } else {
            Favorite newFavorite = Favorite.builder()
                    .memberId(memberId)
                    .menuId(menuId)
                    .build();
            favoritePersistencePort.save(newFavorite);
            return true;
        }
    }

    @Override
    public boolean isFavorite(UUID memberId, Long menuId) {
        return favoritePersistencePort.findByMemberIdAndMenuId(memberId, menuId).isPresent();
    }

    @Override
    public List<Menu> getFavoriteMenus(UUID memberId) {
        List<Favorite> favorites = favoritePersistencePort.findByMemberId(memberId);
        
        return favorites.stream()
                .map(favorite -> loadMenuPort.findAvailableById(favorite.getMenuId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }
}
