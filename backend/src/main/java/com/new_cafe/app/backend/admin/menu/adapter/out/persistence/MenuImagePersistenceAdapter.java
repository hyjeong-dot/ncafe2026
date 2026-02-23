package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component("adminMenuImagePersistenceAdapter")
@RequiredArgsConstructor
public class MenuImagePersistenceAdapter implements MenuImagePort {

    private final AdminMenuImageJpaRepository repository;

    @Override
    public Long saveImage(AdminMenuImage image) {
        return repository.save(image).getId();
    }

    @Override
    public void deleteImage(Long imageId) {
        repository.deleteById(imageId);
    }

    @Override
    public Optional<AdminMenuImage> findImageById(Long imageId) {
        return repository.findById(imageId);
    }

    @Override
    public java.util.List<AdminMenuImage> findAllByMenuId(Long menuId) {
        return repository.findAllByMenuIdOrderBySortOrderAsc(menuId);
    }
}
