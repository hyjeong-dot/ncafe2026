package com.new_cafe.app.backend.favorite.application.service;

import com.new_cafe.app.backend.favorite.application.command.CheckFavoriteCommand;
import com.new_cafe.app.backend.favorite.application.result.CheckFavoriteResult;
import com.new_cafe.app.backend.favorite.application.port.out.LoadFavoritePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckFavoriteService implements CheckFavoriteUseCase {

    private final LoadFavoritePort loadFavoritePort;

    @Override
    public CheckFavoriteResult isFavorite(CheckFavoriteCommand command) {
        boolean isFavorite = loadFavoritePort.findByMemberIdAndMenuId(command.getMemberId(), command.getMenuId()).isPresent();
        return CheckFavoriteResult.builder().isFavorite(isFavorite).build();
    }
}
