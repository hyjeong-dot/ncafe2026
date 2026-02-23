package com.new_cafe.app.backend.menu.adapter.in.web;

import com.new_cafe.app.backend.menu.application.port.in.GetMenuDetailUseCase;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuImageListUseCase;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.menu.application.result.MenuDetailResult;
import com.new_cafe.app.backend.menu.application.result.MenuImageListResult;
import com.new_cafe.app.backend.menu.application.result.MenuListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자용 메뉴 조회 컨트롤러 (Input Adapter)
 * - /menus 경로를 사용하며, 판매 가능한 메뉴 정보만 노출합니다.
 */
@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
public class MenuController {

    private final GetMenuListUseCase getMenuListUseCase;
    private final GetMenuDetailUseCase getMenuDetailUseCase;
    private final GetMenuImageListUseCase getMenuImageListUseCase;

    /**
     * 판매 가능한 메뉴 목록 조회
     */
    @GetMapping
    public MenuListResult getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return getMenuListUseCase.getAvailableMenus(categoryId, searchQuery);
    }

    /**
     * 메뉴 상세 조회
     */
    @GetMapping("/{id}")
    public MenuDetailResult getMenu(@PathVariable Long id) {
        return getMenuDetailUseCase.getAvailableMenu(id);
    }

    /**
     * 메뉴 이미지 목록 조회
     */
    @GetMapping("/{id}/images")
    public MenuImageListResult getMenuImages(@PathVariable Long id) {
        return getMenuImageListUseCase.getMenuImages(id);
    }
}
