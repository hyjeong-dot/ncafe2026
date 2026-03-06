package com.new_cafe.app.backend.favorite.application.port.out;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoritePersistencePort {
    
    /**
     * 특정 회원과 메뉴의 찜 정보 조회
     */
    Optional<Favorite> findByMemberIdAndMenuId(UUID memberId, Long menuId);

    /**
     * 찜 정보 저장
     */
    Favorite save(Favorite favorite);

    /**
     * 찜 정보 삭제
     */
    void delete(Favorite favorite);

    /**
     * 회원이 찜한 정보 목록 조회
     */
    List<Favorite> findByMemberId(UUID memberId);
}
