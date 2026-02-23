package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MenuPersistenceAdapter implements LoadMenuPort {

    private final MenuJpaRepository menuJpaRepository;

    @Override
    public List<Menu> findAllAvailable() {
        return menuJpaRepository.findAllByIsAvailableTrueOrderBySortOrderAsc();
    }

    @Override
    public List<Menu> findAllAvailableByCategoryId(Long categoryId) {
        return menuJpaRepository.findAllByIsAvailableTrueAndCategoryIdOrderBySortOrderAsc(categoryId);
    }

    @Override
    public Optional<Menu> findAvailableById(Long id) {
        return menuJpaRepository.findByIdAndIsAvailableTrue(id);
    }
}
