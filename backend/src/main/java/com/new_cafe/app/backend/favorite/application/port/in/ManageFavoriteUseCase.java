package com.new_cafe.app.backend.favorite.application.port.in;

import com.new_cafe.app.backend.menu.domain.model.Menu;
import java.util.List;
import java.util.UUID;

public interface ManageFavoriteUseCase {
    
    /**
     * 특정 메뉴 찜하기 토글 (찜안되어있으면 추가, 되어있으면 삭제)
     * @return 찜된 상태여부 (true: 추가됨, false: 삭제됨)
     */
    boolean toggleFavorite(UUID memberId, Long menuId);

    /**
     * 특정 메뉴가 찜되어있는지 여부 조회
     */
    boolean isFavorite(UUID memberId, Long menuId);

    /**
     * 내가 찜한 메뉴 목록 조회
     */
    List<Menu> getFavoriteMenus(UUID memberId);
}
