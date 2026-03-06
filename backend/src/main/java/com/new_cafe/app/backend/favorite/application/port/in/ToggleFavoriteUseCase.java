package com.new_cafe.app.backend.favorite.application.port.in;

import com.new_cafe.app.backend.favorite.application.command.ToggleFavoriteCommand;

import com.new_cafe.app.backend.favorite.application.result.ToggleFavoriteResult;

public interface ToggleFavoriteUseCase {
    ToggleFavoriteResult toggleFavorite(ToggleFavoriteCommand command);
}
