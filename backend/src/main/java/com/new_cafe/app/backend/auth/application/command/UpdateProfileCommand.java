package com.new_cafe.app.backend.auth.application.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateProfileCommand {
    private final String username;
    private final String nickname;
    private final String password; // null if not changing
    private final String email;
    private final String phoneNumber;
}
