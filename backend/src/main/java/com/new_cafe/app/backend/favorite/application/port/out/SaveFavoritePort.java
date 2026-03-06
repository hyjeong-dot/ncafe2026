package com.new_cafe.app.backend.favorite.application.port.out;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;

public interface SaveFavoritePort {
    /**
     * 찜 정보 쓰기 (생성 또는 저장)
     */
    Favorite save(Favorite favorite);
}
