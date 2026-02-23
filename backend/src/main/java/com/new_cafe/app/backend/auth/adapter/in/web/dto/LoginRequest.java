package com.new_cafe.app.backend.auth.adapter.in.web.dto;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;

    public LoginCommand toCommand() {
        return LoginCommand.builder()
                .username(username)
                .password(password)
                .build();
    }
}
