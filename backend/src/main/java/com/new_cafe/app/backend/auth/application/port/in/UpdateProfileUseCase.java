package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.UpdateProfileCommand;

public interface UpdateProfileUseCase {
    void updateProfile(UpdateProfileCommand command);
}
