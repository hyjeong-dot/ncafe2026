package com.new_cafe.app.backend.auth.domain.model;

/**
 * 회원 도메인 모델 (순수 자바 객체)
 * - 외부 기술(Spring, JPA 등)에 의존하지 않습니다.
 * - 비즈니스 규칙과 검증 로직을 이 클래스에 작성합니다.
 */
public class Member {

    private Long id;
    private String username;
    private String password;
    private String name;
    private String role; // "ADMIN", "USER" 등

    public Member() {
    }

    public Member(Long id, String username, String password, String name, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    // --- 비즈니스 로직 ---

    /**
     * 비밀번호가 일치하는지 검증합니다.
     * TODO: 직접 인증 로직을 구현하세요.
     *       예) BCrypt 비교, 평문 비교 등
     */
    public boolean authenticate(String rawPassword) {
        // TODO: 여기에 직접 인증 로직을 구현하세요.
        // 예시: return this.password.equals(rawPassword);
        throw new UnsupportedOperationException("인증 로직을 직접 구현하세요.");
    }

    public boolean isAdmin() {
        return "ADMIN".equals(this.role);
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
