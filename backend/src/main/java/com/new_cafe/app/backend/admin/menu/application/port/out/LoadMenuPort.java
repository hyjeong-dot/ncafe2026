package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import java.util.List;
import java.util.Optional;

/**
 * 메뉴 조회 포트 (영속성 계층 호출 인터페이스)
 */
public interface LoadMenuPort {
    List<Menu> findAll(Long categoryId, String searchQuery);
    Optional<Menu> findById(Long id);
    boolean existsBySlug(String slug);
    List<Menu> findAllBySlugIsNull();
    long countBySlugStartingWith(String slugPrefix);
}
