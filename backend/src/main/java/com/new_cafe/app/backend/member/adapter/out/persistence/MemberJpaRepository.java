package com.new_cafe.app.backend.member.adapter.out.persistence;

import com.new_cafe.app.backend.member.domain.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface MemberJpaRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByNickname(String nickname);
    boolean existsByNickname(String nickname);
    void deleteByNickname(String nickname);
    
    long countByCreatedAtAfter(java.time.LocalDateTime date);
}
