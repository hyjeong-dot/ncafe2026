package com.new_cafe.app.backend.favorite.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ToggleFavoriteResult {
    private final boolean isFavorite;
}
