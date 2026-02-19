package com.new_cafe.app.backend.auth.domain.exception;

/**
 * 인증 실패 시 발생하는 도메인 예외
 */
public class AuthenticationFailedException extends RuntimeException {

    public AuthenticationFailedException() {
        super("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    public AuthenticationFailedException(String message) {
        super(message);
    }
}
