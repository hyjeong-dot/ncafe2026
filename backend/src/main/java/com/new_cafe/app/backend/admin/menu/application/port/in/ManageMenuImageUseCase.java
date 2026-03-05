package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.AddMenuImageCommand;
import com.new_cafe.app.backend.admin.menu.application.result.MenuImageListResult;

public interface ManageMenuImageUseCase {
    Long addImage(AddMenuImageCommand command);
    void removeImage(Long imageId);
    void updateImageOrder(Long imageId, int newOrder);
    void setPrimaryImage(Long menuId, Long imageId);
    MenuImageListResult getImagesByMenuId(Long menuId);
}
