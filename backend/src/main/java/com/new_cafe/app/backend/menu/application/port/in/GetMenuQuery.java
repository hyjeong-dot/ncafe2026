package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.domain.model.Menu;

import java.util.List;

/**
 * 메뉴 조회 유스케이스 (Input Port)
 * - 메뉴 목록 조회, 상세 조회 등 읽기 전용 작업을 정의합니다.
 */
public interface GetMenuQuery {

    /**
     * 메뉴 목록 조회 (카테고리 필터, 검색어 필터)
     */
    List<Menu> getMenus(Long categoryId, String searchQuery);

    /**
     * 메뉴 상세 조회
     */
    Menu getMenu(Long id);
}
