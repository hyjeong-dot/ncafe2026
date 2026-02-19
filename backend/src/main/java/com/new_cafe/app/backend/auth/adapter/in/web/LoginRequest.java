package com.new_cafe.app.backend.auth.adapter.in.web;

/**
 * 로그인 요청 DTO (Input Adapter 전용)
 * - 컨트롤러(웹 계층)에서만 사용합니다.
 * - 도메인이나 서비스 계층에는 전달되지 않습니다.
 */
public class LoginRequest {

    private String username;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
