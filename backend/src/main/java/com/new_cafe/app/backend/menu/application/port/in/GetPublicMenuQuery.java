package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.category.domain.model.Category;

import java.util.List;

/**
 * 회원용 메뉴 조회 유스케이스 (Input Port)
 * - 관리자용(GetMenuQuery)과 다르게, 판매 가능한 메뉴만 반환합니다.
 * - 품절(isSoldOut) 메뉴는 표시하되, 비활성(isAvailable=false)은 제외합니다.
 */
public interface GetPublicMenuQuery {

    /**
     * 카테고리별 메뉴 목록 조회 (판매 가능한 것만)
     */
    List<Menu> getAvailableMenus(Long categoryId);

    /**
     * 메뉴 상세 조회 (판매 가능한 것만)
     */
    Menu getAvailableMenu(Long id);

    /**
     * 카테고리 목록 조회
     */
    List<Category> getCategories();
}
