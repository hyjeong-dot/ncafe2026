package com.new_cafe.app.backend.auth.application.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginCommand {
    private final String username;
    private final String password;
}
