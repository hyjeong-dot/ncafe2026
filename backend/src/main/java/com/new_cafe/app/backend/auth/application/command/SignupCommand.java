package com.new_cafe.app.backend.auth.application.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupCommand {
    private String username;
    private String password;
    private String nickname;
    private String email;
    private String phoneNumber;
}
