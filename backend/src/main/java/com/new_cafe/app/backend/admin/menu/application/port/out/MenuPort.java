package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import java.util.List;
import java.util.Optional;

/**
 * 메뉴 영속성 포트 (관리자 전용)
 * - 메뉴의 저장, 조회, 삭제를 위한 아웃바운드 포트입니다.
 */
public interface MenuPort {
    Long save(Menu menu);
    List<Menu> findAll(Long categoryId, String searchQuery);
    Optional<Menu> findById(Long id);
    void deleteById(Long id);
}
