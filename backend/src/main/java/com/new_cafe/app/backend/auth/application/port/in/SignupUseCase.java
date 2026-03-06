package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.SignupCommand;
import com.new_cafe.app.backend.auth.application.result.SignupResult;

public interface SignupUseCase {
    SignupResult signup(SignupCommand command);
}
