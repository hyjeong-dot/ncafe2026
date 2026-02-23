package com.new_cafe.app.backend.auth.domain.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 회원 도메인 모델 및 JPA 엔티티
 */
@Entity
@Table(name = "member")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String name;

    private String role; // "ADMIN", "USER" 등

    // --- 비즈니스 로직 ---

    /**
     * 비밀번호가 일치하는지 검증합니다.
     * 실제 서비스에서는 PasswordEncoder를 사용하는 것이 좋으나, 
     * 현재 구조를 유지하며 인증 로직을 보강합니다.
     */
    public boolean authenticate(String rawPassword) {
        if (this.password == null || rawPassword == null) {
            return false;
        }
        return this.password.equals(rawPassword);
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.role);
    }
}
