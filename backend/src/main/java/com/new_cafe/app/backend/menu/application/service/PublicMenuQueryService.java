package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.menu.application.port.in.GetPublicMenuQuery;
import com.new_cafe.app.backend.menu.application.port.out.LoadAvailableMenuPort;
import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 회원용 메뉴 조회 서비스 (Input Port 구현체)
 * - 관리자용(MenuQueryService)과 다르게, 판매 가능한 메뉴만 반환합니다.
 * - 같은 Output Port를 공유하지만, 비즈니스 규칙이 다릅니다.
 */
@Service
public class PublicMenuQueryService implements GetPublicMenuQuery {

    private final LoadAvailableMenuPort loadAvailableMenuPort;
    private final LoadCategoryPort loadCategoryPort;

    public PublicMenuQueryService(LoadAvailableMenuPort loadAvailableMenuPort,
                                  LoadCategoryPort loadCategoryPort) {
        this.loadAvailableMenuPort = loadAvailableMenuPort;
        this.loadCategoryPort = loadCategoryPort;
    }

    @Override
    public List<Menu> getAvailableMenus(Long categoryId) {
        return loadAvailableMenuPort.findAvailableByCategoryId(categoryId);
    }

    @Override
    public Menu getAvailableMenu(Long id) {
        return loadAvailableMenuPort.findAvailableById(id)
                .orElseThrow(() -> new MenuNotFoundException(id));
    }

    @Override
    public List<Category> getCategories() {
        return loadCategoryPort.findAll();
    }
}
