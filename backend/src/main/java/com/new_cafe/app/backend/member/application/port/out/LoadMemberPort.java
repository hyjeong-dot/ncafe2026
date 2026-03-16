package com.new_cafe.app.backend.member.application.port.out;

import com.new_cafe.app.backend.member.domain.model.Member;
import java.util.Optional;
import java.util.UUID;

/**
 * 회원 조회 포트 (Output Port / Driven Port)
 */
public interface LoadMemberPort {

    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByUsername(String username);
    Optional<Member> findById(UUID memberId);
}
