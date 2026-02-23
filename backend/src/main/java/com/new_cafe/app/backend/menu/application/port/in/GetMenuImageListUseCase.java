package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.application.result.MenuImageListResult;

/**
 * 메뉴 이미지 목록 조회 유스케이스
 */
public interface GetMenuImageListUseCase {
    MenuImageListResult getMenuImages(Long menuId);
}
