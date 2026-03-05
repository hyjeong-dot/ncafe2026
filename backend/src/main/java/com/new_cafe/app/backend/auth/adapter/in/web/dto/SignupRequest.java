package com.new_cafe.app.backend.auth.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.new_cafe.app.backend.auth.application.command.SignupCommand;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String username;
    private String password;

    public SignupCommand toCommand() {
        return new SignupCommand(username, password);
    }
}
