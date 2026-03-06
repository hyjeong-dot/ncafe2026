package com.new_cafe.app.backend.favorite.application.port.in;

import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuListResult;
import java.util.UUID;

public interface GetFavoriteMenusUseCase {
    FavoriteMenuListResult getFavoriteMenus(UUID memberId);
}
