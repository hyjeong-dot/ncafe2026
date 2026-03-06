package com.new_cafe.app.backend.favorite.application.port.out;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;

public interface DeleteFavoritePort {
    /**
     * 찜 정보 삭제
     */
    void delete(Favorite favorite);
}
