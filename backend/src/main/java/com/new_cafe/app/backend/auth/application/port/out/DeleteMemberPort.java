package com.new_cafe.app.backend.auth.application.port.out;

public interface DeleteMemberPort {
    void deleteByNickname(String nickname);
}
