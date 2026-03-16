package com.new_cafe.app.backend.global.error;

import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationFailedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleAuthenticationFailedException(AuthenticationFailedException e) {
        return Map.of("success", false, "message", e.getMessage() != null ? e.getMessage() : "인증에 실패했습니다.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleIllegalArgumentException(IllegalArgumentException e) {
        return Map.of("success", false, "message", e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleIllegalStateException(IllegalStateException e) {
        return Map.of("success", false, "message", e.getMessage() != null ? e.getMessage() : "잘못된 상태입니다.");
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleRuntimeException(RuntimeException e) {
        return Map.of("success", false, "message", e.getMessage() != null ? e.getMessage() : "서버 오류가 발생했습니다.");
    }
}
