package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.domain.model.MenuImage;

import java.util.List;

/**
 * 메뉴 이미지 조회 유스케이스 (Input Port)
 */
public interface GetMenuImageQuery {

    /**
     * 특정 메뉴의 이미지 목록 조회
     */
    List<MenuImage> getMenuImages(Long menuId);
}
