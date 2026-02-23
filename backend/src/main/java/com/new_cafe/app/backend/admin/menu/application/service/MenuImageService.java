package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.AddMenuImageCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.ManageMenuImageUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuImageService implements ManageMenuImageUseCase {

    private final MenuImagePort menuImagePort;

    @Override
    public Long addImage(AddMenuImageCommand command) {
        AdminMenuImage image = AdminMenuImage.builder()
                .menuId(command.getMenuId())
                .srcUrl(command.getSrcUrl())
                .sortOrder(command.getSortOrder())
                .build();
        return menuImagePort.saveImage(image);
    }

    @Override
    public void removeImage(Long imageId) {
        menuImagePort.deleteImage(imageId);
    }

    @Override
    public void updateImageOrder(Long imageId, int newOrder) {
        AdminMenuImage image = menuImagePort.findImageById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다. ID: " + imageId));
        image.updateSortOrder(newOrder);
        menuImagePort.saveImage(image);
    }
}
