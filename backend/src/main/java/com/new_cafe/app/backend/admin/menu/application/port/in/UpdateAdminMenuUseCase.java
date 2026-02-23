package com.new_cafe.app.backend.admin.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;

public interface UpdateAdminMenuUseCase {
    void updateMenu(UpdateAdminMenuCommand command);
}
