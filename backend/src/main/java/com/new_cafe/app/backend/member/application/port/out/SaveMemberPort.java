package com.new_cafe.app.backend.member.application.port.out;

import com.new_cafe.app.backend.member.domain.model.Member;

public interface SaveMemberPort {
    Member save(Member member);
    boolean existsByNickname(String nickname);
}
