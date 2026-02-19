package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.auth.domain.model.Member;
import org.springframework.stereotype.Service;

/**
 * 로그인 서비스 (Input Port 구현체)
 * - 유스케이스 흐름을 제어합니다.
 * - 도메인 모델에게 비즈니스 로직을 위임합니다.
 * - Output Port를 통해 외부 자원(DB)에 접근합니다.
 */
@Service
public class AuthService implements LoginUseCase {

    private final LoadMemberPort loadMemberPort;

    public AuthService(LoadMemberPort loadMemberPort) {
        this.loadMemberPort = loadMemberPort;
    }

    @Override
    public LoginResult login(LoginCommand command) {
        // 1. Output Port를 통해 회원 조회
        Member member = loadMemberPort.findByUsername(command.username())
                .orElseThrow(AuthenticationFailedException::new);

        // 2. 도메인 모델에게 인증 위임
        //    TODO: Member.authenticate() 메서드를 직접 구현하세요.
        if (!member.authenticate(command.password())) {
            throw new AuthenticationFailedException();
        }

        // 3. 결과 반환
        return new LoginResult(
                member.getId(),
                member.getUsername(),
                member.getName(),
                member.getRole()
        );
    }
}
