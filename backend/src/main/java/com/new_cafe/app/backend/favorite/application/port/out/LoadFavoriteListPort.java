package com.new_cafe.app.backend.favorite.application.port.out;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import java.util.List;
import java.util.UUID;

public interface LoadFavoriteListPort {
    /**
     * 회원이 찜한 정보 목록 모두 조회
     */
    List<Favorite> findFavoritesByMemberId(UUID memberId);
}
