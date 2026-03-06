package com.new_cafe.app.backend.favorite.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FavoriteMenuResult {
    private final Long id;
    private final String korName;
    private final String engName;
    private final int price;
    private final String description;
    private final Long categoryId;
}
