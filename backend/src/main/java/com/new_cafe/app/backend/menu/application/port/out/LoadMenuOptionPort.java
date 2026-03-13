package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import java.util.List;

/**
 * 사용자용 메뉴 옵션 조회 포트
 * - admin 도메인의 MenuOption/OptionItem 엔티티를 읽기 전용으로 사용
 */
public interface LoadMenuOptionPort {
    List<MenuOption> findAllByMenuId(Long menuId);
    List<OptionItem> findAllByOptionId(Long optionId);
}
