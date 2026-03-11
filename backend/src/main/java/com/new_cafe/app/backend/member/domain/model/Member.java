package com.new_cafe.app.backend.member.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * 회원 도메인 모델 및 JPA 엔티티
 * 'members' 테이블과 매핑됩니다.
 */
@Entity
@Table(name = "members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "nickname", nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private String password;

    private String role; // "ROLE_ADMIN", "ROLE_USER"

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = java.time.LocalDateTime.now();
    }

    // --- 비즈니스 로직 ---

    public boolean isAdmin() {
        return "ROLE_ADMIN".equalsIgnoreCase(this.role);
    }
}
