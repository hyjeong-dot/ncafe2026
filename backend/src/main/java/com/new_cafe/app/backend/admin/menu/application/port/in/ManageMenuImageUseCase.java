package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.AddMenuImageCommand;

public interface ManageMenuImageUseCase {
    Long addImage(AddMenuImageCommand command);
    void removeImage(Long imageId);
    void updateImageOrder(Long imageId, int newOrder);
}
