package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.UpdateProfileCommand;
import com.new_cafe.app.backend.auth.application.port.in.UpdateProfileUseCase;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
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
@Transactional
public class UpdateProfileService implements UpdateProfileUseCase {

    private final LoadMemberPort loadMemberPort;
    private final SaveMemberPort saveMemberPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void updateProfile(UpdateProfileCommand command) {
        log.info("Updating profile for user: {}", command.getUsername());

        Member member = loadMemberPort.findByUsername(command.getUsername())
                .orElseThrow(() -> {
                    log.warn("Member not found for update: {}", command.getUsername());
                    return new AuthenticationFailedException();
                });

        if (command.getNickname() != null && !command.getNickname().isBlank()) {
            member.setNickname(command.getNickname());
        }
        
        if (command.getEmail() != null) {
            member.setEmail(command.getEmail());
        }
        
        if (command.getPhoneNumber() != null) {
            member.setPhoneNumber(command.getPhoneNumber());
        }

        if (command.getPassword() != null && !command.getPassword().isBlank()) {
            member.setPassword(passwordEncoder.encode(command.getPassword()));
        }

        saveMemberPort.save(member);
        log.info("Profile updated successfully for user: {}", command.getUsername());
    }
}
