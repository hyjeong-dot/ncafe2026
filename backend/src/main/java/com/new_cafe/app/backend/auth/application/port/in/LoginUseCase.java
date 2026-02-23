package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.result.LoginResult;

public interface LoginUseCase {
    LoginResult login(LoginCommand command);
}
