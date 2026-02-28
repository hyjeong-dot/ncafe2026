package com.new_cafe.app.backend.auth.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class LoginResult {
    private final UUID memberId;
    private final String username;
    private final String name;
    private final String role;
}
