package com.new_cafe.app.backend.favorite.application.port.in;

import com.new_cafe.app.backend.favorite.application.command.CheckFavoriteCommand;

import com.new_cafe.app.backend.favorite.application.result.CheckFavoriteResult;

public interface CheckFavoriteUseCase {
    CheckFavoriteResult isFavorite(CheckFavoriteCommand command);
}
