package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.auth.application.result.LoginResult;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.auth.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService implements LoginUseCase {

    private final LoadMemberPort loadMemberPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResult login(LoginCommand command) {
        Member member = loadMemberPort.findByNickname(command.getUsername())
                .orElseThrow(AuthenticationFailedException::new);

        if (!passwordEncoder.matches(command.getPassword(), member.getPassword())) {
            throw new AuthenticationFailedException();
        }

        return LoginResult.builder()
                .memberId(member.getId())
                .username(member.getNickname())
                .name(member.getNickname()) // 'name' 컬럼이 없으므로 'nickname' 사용
                .role(member.getRole())
                .build();
    }
}
