package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MenuPersistenceAdapter implements MenuPort {

    private final MenuJpaRepository menuJpaRepository;

    @Override
    public Long save(Menu menu) {
        return menuJpaRepository.save(menu).getId();
    }

    @Override
    public List<Menu> findAll(Long categoryId, String searchQuery) {
        return menuJpaRepository.findAllByFilter(categoryId, searchQuery);
    }

    @Override
    public Optional<Menu> findById(Long id) {
        return menuJpaRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        menuJpaRepository.deleteById(id);
    }
}
