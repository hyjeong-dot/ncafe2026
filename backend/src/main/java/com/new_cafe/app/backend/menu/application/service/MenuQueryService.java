package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.menu.application.port.in.GetMenuQuery;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuImageQuery;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 메뉴 조회 서비스 (Input Port 구현체)
 * - GetMenuQuery, GetMenuImageQuery를 구현합니다.
 */
@Service
public class MenuQueryService implements GetMenuQuery, GetMenuImageQuery {

    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;

    public MenuQueryService(LoadMenuPort loadMenuPort,
                            LoadMenuImagePort loadMenuImagePort) {
        this.loadMenuPort = loadMenuPort;
        this.loadMenuImagePort = loadMenuImagePort;
    }

    // ===== GetMenuQuery 구현 =====

    @Override
    public List<Menu> getMenus(Long categoryId, String searchQuery) {
        return loadMenuPort.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);
    }

    @Override
    public Menu getMenu(Long id) {
        return loadMenuPort.findById(id)
                .orElseThrow(() -> new MenuNotFoundException(id));
    }

    // ===== GetMenuImageQuery 구현 =====

    @Override
    public List<MenuImage> getMenuImages(Long menuId) {
        // 메뉴 존재 여부 먼저 확인
        loadMenuPort.findById(menuId)
                .orElseThrow(() -> new MenuNotFoundException(menuId));
        return loadMenuImagePort.findAllByMenuId(menuId);
    }
}
