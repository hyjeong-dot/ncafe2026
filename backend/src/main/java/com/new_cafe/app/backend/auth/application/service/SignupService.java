package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.SignupCommand;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.result.SignupResult;
import com.new_cafe.app.backend.coupon.application.service.CouponService;
import com.new_cafe.app.backend.member.application.port.out.SaveMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignupService implements SignupUseCase {

    private final SaveMemberPort saveMemberPort;
    private final PasswordEncoder passwordEncoder;
    private final CouponService couponService;

    @Override
    @Transactional
    public SignupResult signup(SignupCommand command) {
        if (saveMemberPort.existsByUsername(command.getUsername())) {
             throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        Member newMember = Member.builder()
                .username(command.getUsername())
                .password(passwordEncoder.encode(command.getPassword()))
                .nickname(command.getNickname())
                .email(command.getEmail())
                .phoneNumber(command.getPhoneNumber())
                .role("ROLE_USER")
                .build();
        
        Member savedMember = saveMemberPort.save(newMember);
        log.info("Signup successful for user: {}", command.getUsername());

        // 첫 방문 쿠폰 자동 발급
        try {
            couponService.issueWelcomeCoupon(savedMember.getId());
            log.info("Welcome coupon issued for user: {}", command.getUsername());
        } catch (Exception e) {
            log.warn("Failed to issue welcome coupon for user: {}", command.getUsername(), e);
        }
        
        return SignupResult.builder()
                .memberId(savedMember.getId())
                .username(savedMember.getUsername())
                .build();
    }
}

