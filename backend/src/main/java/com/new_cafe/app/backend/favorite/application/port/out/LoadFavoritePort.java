package com.new_cafe.app.backend.favorite.application.port.out;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import java.util.Optional;
import java.util.UUID;

public interface LoadFavoritePort {
    /**
     * 특정 회원과 메뉴의 찜 정보 단건 조회
     */
    Optional<Favorite> findByMemberIdAndMenuId(UUID memberId, Long menuId);
}
