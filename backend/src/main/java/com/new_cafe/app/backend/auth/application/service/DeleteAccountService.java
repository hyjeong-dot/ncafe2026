package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.DeleteAccountUseCase;
import com.new_cafe.app.backend.member.application.port.out.DeleteMemberPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeleteAccountService implements DeleteAccountUseCase {

    private final DeleteMemberPort deleteMemberPort;

    @Override
    @Transactional
    public void deleteAccount(String username) {
        log.info("Deleting account for user: {}", username);
        deleteMemberPort.deleteByNickname(username);
        log.info("Account deleted successfully for user: {}", username);
    }
}
