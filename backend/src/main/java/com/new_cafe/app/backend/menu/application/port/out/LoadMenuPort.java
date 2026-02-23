package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.Menu;
import java.util.List;
import java.util.Optional;

/**
 * 사용자용 메뉴 로드 포트
 * - 판매 가능한 메뉴 조회에 특화
 */
public interface LoadMenuPort {
    List<Menu> findAllAvailable();
    List<Menu> findAllAvailableByCategoryId(Long categoryId);
    Optional<Menu> findAvailableById(Long id);
}
