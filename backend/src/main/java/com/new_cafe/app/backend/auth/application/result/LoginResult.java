package com.new_cafe.app.backend.auth.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResult {
    private final Long memberId;
    private final String username;
    private final String name;
    private final String role;
}
