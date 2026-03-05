package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.SignupCommand;

public interface SignupUseCase {
    void signup(SignupCommand command);
}
