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

    @Override
    public com.new_cafe.app.backend.admin.menu.application.result.MenuImageListResult getImagesByMenuId(Long menuId) {
        java.util.List<AdminMenuImage> images = menuImagePort.findAllByMenuId(menuId);
        java.util.List<com.new_cafe.app.backend.admin.menu.application.result.MenuImageResult> imageResults = images.stream()
                .map(img -> com.new_cafe.app.backend.admin.menu.application.result.MenuImageResult.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(java.util.stream.Collectors.toList());
        
        return com.new_cafe.app.backend.admin.menu.application.result.MenuImageListResult.builder()
                .images(imageResults)
                .build();
    }
}
