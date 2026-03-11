package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component("adminMenuPersistenceAdapter")
@RequiredArgsConstructor
public class MenuPersistenceAdapter implements SaveMenuPort, LoadMenuPort, DeleteMenuPort {

    private final AdminMenuJpaRepository menuJpaRepository;

    @Override
    public Long save(Menu menu) {
        return menuJpaRepository.save(menu).getId();
    }

    @Override
    public List<Menu> findAll(Long categoryId, String searchQuery) {
        boolean hasCategory = categoryId != null;
        boolean hasSearch = searchQuery != null && !searchQuery.isBlank();

        if (hasCategory && hasSearch) {
            return menuJpaRepository.findAllByCategoryIdAndKorNameContainingIgnoreCaseOrCategoryIdAndEngNameContainingIgnoreCaseOrderBySortOrderAsc(categoryId, searchQuery, categoryId, searchQuery);
        } else if (hasCategory) {
            return menuJpaRepository.findAllByCategoryIdOrderBySortOrderAsc(categoryId);
        } else if (hasSearch) {
            return menuJpaRepository.findAllByKorNameContainingIgnoreCaseOrEngNameContainingIgnoreCaseOrderBySortOrderAsc(searchQuery, searchQuery);
        } else {
            return menuJpaRepository.findAllByOrderBySortOrderAsc();
        }
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
