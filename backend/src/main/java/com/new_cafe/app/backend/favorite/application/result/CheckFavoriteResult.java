package com.new_cafe.app.backend.favorite.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckFavoriteResult {
    private final boolean isFavorite;
}
