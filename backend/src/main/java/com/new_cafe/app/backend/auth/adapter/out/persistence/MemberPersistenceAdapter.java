package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveMemberPort;
import com.new_cafe.app.backend.auth.application.port.out.DeleteMemberPort;
import com.new_cafe.app.backend.auth.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MemberPersistenceAdapter implements LoadMemberPort, SaveMemberPort, DeleteMemberPort {

    private final MemberJpaRepository memberJpaRepository;

    @Override
    public Optional<Member> findByNickname(String nickname) {
        return memberJpaRepository.findByNickname(nickname);
    }

    @Override
    public Member save(Member member) {
        return memberJpaRepository.save(member);
    }

    @Override
    public boolean existsByNickname(String nickname) {
        return memberJpaRepository.existsByNickname(nickname);
    }

    @Override
    public void deleteByNickname(String nickname) {
        memberJpaRepository.deleteByNickname(nickname);
    }
}
