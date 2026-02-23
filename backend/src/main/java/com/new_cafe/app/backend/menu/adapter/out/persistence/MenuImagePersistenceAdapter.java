package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MenuImagePersistenceAdapter implements LoadMenuImagePort {

    private final MenuImageJpaRepository menuImageJpaRepository;

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        return menuImageJpaRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
    }
}
