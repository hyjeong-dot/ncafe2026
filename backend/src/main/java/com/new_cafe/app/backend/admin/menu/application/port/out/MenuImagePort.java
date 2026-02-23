package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import java.util.Optional;

public interface MenuImagePort {
    Long saveImage(AdminMenuImage image);
    void deleteImage(Long imageId);
    Optional<AdminMenuImage> findImageById(Long imageId);
}
