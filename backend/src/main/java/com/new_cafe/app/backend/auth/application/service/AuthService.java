package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.command.SignupCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.port.in.DeleteAccountUseCase;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.application.port.out.SaveMemberPort;
import com.new_cafe.app.backend.member.application.port.out.DeleteMemberPort;
import com.new_cafe.app.backend.auth.application.result.LoginResult;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService implements LoginUseCase, SignupUseCase, DeleteAccountUseCase {

    private final LoadMemberPort loadMemberPort;
    private final SaveMemberPort saveMemberPort;
    private final DeleteMemberPort deleteMemberPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResult login(LoginCommand command) {
        log.info("Login attempt for username: {}", command.getUsername());
        
        Member member = loadMemberPort.findByNickname(command.getUsername())
                .orElseThrow(() -> {
                    log.warn("Member not found: {}", command.getUsername());
                    return new AuthenticationFailedException();
                });

        log.info("Member found, checking password for user: {}", member.getNickname());

        if (!passwordEncoder.matches(command.getPassword(), member.getPassword())) {
            log.warn("Password mismatch for user: {}", command.getUsername());
            throw new AuthenticationFailedException();
        }

        log.info("Login successful for user: {}", command.getUsername());

        return LoginResult.builder()
                .memberId(member.getId())
                .username(member.getNickname())
                .name(member.getNickname()) // 'name' 컬럼이 없으므로 'nickname' 사용
                .role(member.getRole())
                .build();
    }

    @Override
    @Transactional
    public void signup(SignupCommand command) {
        if (saveMemberPort.existsByNickname(command.getUsername())) {
             throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        Member newMember = Member.builder()
                .nickname(command.getUsername())
                .password(passwordEncoder.encode(command.getPassword()))
                .role("ROLE_USER")
                .build();
        
        saveMemberPort.save(newMember);
        log.info("Signup successful for user: {}", command.getUsername());
    }

    @Override
    @Transactional
    public void deleteAccount(String username) {
        log.info("Deleting account for user: {}", username);
        deleteMemberPort.deleteByNickname(username);
        log.info("Account deleted successfully for user: {}", username);
    }
}
