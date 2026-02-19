package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.Menu;

import java.util.List;
import java.util.Optional;

/**
 * 판매 가능 메뉴 전용 로드 포트 (Output Port)
 * - 회원용 조회는 isAvailable=true 인 메뉴만 반환합니다.
 * - 관리자용(LoadMenuPort)과 분리하여 쿼리 최적화가 가능합니다.
 */
public interface LoadAvailableMenuPort {

    /**
     * 판매 가능한 메뉴 전체 조회 (카테고리 필터 가능)
     */
    List<Menu> findAvailableByCategoryId(Long categoryId);

    /**
     * 판매 가능한 메뉴 상세 조회
     */
    Optional<Menu> findAvailableById(Long id);
}
