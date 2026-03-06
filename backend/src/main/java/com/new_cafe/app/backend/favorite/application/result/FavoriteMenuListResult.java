package com.new_cafe.app.backend.favorite.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class FavoriteMenuListResult {
    private final List<FavoriteMenuResult> menus;
}
