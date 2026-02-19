package com.new_cafe.app.backend.auth.adapter.in.web;

/**
 * 로그인 응답 DTO (Input Adapter 전용)
 */
public class LoginResponse {

    private Long memberId;
    private String username;
    private String name;
    private String role;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(Long memberId, String username, String name, String role, String message) {
        this.memberId = memberId;
        this.username = username;
        this.name = name;
        this.role = role;
        this.message = message;
    }

    // 성공 팩토리 메서드
    public static LoginResponse success(Long memberId, String username, String name, String role) {
        return new LoginResponse(memberId, username, name, role, "로그인 성공");
    }

    // 실패 팩토리 메서드
    public static LoginResponse fail(String message) {
        return new LoginResponse(null, null, null, null, message);
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
