package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.MenuImage;

import java.util.List;

/**
 * 메뉴 이미지 로드 포트 (Output Port)
 */
public interface LoadMenuImagePort {

    List<MenuImage> findAllByMenuId(Long menuId);
}
