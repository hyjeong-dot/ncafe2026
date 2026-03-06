package com.new_cafe.app.backend.favorite.application.service;

import com.new_cafe.app.backend.favorite.application.port.in.ToggleFavoriteUseCase;
import com.new_cafe.app.backend.favorite.application.command.ToggleFavoriteCommand;
import com.new_cafe.app.backend.favorite.application.result.ToggleFavoriteResult;
import com.new_cafe.app.backend.favorite.application.port.out.LoadFavoritePort;
import com.new_cafe.app.backend.favorite.application.port.out.SaveFavoritePort;
import com.new_cafe.app.backend.favorite.application.port.out.DeleteFavoritePort;
import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ToggleFavoriteService implements ToggleFavoriteUseCase {

    private final LoadFavoritePort loadFavoritePort;
    private final SaveFavoritePort saveFavoritePort;
    private final DeleteFavoritePort deleteFavoritePort;

    @Override
    @Transactional
    public ToggleFavoriteResult toggleFavorite(ToggleFavoriteCommand command) {
        Optional<Favorite> existing = loadFavoritePort.findByMemberIdAndMenuId(command.getMemberId(), command.getMenuId());
        
        if (existing.isPresent()) {
            deleteFavoritePort.delete(existing.get());
            return ToggleFavoriteResult.builder().isFavorite(false).build();
        } else {
            Favorite newFavorite = Favorite.builder()
                    .memberId(command.getMemberId())
                    .menuId(command.getMenuId())
                    .build();
            saveFavoritePort.save(newFavorite);
            return ToggleFavoriteResult.builder().isFavorite(true).build();
        }
    }
}
