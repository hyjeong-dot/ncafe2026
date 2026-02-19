package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.Menu;

import java.util.List;
import java.util.Optional;

/**
 * 메뉴 로드 포트 (Output Port / Driven Port)
 * - 내부(서비스)에서 외부(DB)로 요청할 때 사용하는 인터페이스
 * - 실제 DB 기술(DataSource, JPA 등)에 의존하지 않습니다.
 */
public interface LoadMenuPort {

    List<Menu> findAll();

    List<Menu> findAllByCategoryId(Long categoryId);

    List<Menu> findAllByCategoryIdAndSearchQuery(Long categoryId, String searchQuery);

    Optional<Menu> findById(Long id);
}
