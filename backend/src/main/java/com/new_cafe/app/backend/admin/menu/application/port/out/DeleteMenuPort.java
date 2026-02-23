package com.new_cafe.app.backend.admin.menu.application.port.out;

/**
 * 메뉴 삭제 포트 (영속성 계층 호출 인터페이스)
 */
public interface DeleteMenuPort {
    void deleteById(Long id);
}
