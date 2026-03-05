package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
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
    public List<AdminMenuImage> findAllByMenuId(Long menuId) {
        return repository.findAllByMenuIdOrderBySortOrderAsc(menuId);
    }

    @Override
    public void deleteByMenuId(Long menuId) {
        repository.deleteByMenuId(menuId);
    }

    @Override
    public void setPrimaryImage(Long menuId, Long imageId) {
        // 이 메뉴의 모든 이미지를 일단 순서 1로 밀어냄 (비대표)
        List<AdminMenuImage> allImages = repository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        for (AdminMenuImage img : allImages) {
            img.updateSortOrder(1);
        }
        
        // 선택된 이미지만 0으로 설정 (대표)
        repository.findById(imageId).ifPresent(img -> {
            img.updateSortOrder(0);
        });
        
        repository.saveAll(allImages);
    }
}
