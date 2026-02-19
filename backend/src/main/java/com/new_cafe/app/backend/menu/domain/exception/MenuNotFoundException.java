package com.new_cafe.app.backend.menu.domain.exception;

/**
 * 메뉴를 찾을 수 없을 때 발생하는 도메인 예외
 */
public class MenuNotFoundException extends RuntimeException {

    public MenuNotFoundException(Long menuId) {
        super("메뉴를 찾을 수 없습니다. (ID: " + menuId + ")");
    }

    public MenuNotFoundException(String message) {
        super(message);
    }
}
