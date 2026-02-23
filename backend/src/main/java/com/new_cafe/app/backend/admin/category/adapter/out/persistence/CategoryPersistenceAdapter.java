package com.new_cafe.app.backend.admin.category.adapter.out.persistence;

import com.new_cafe.app.backend.admin.category.application.port.out.DeleteCategoryPort;
import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.application.port.out.SaveCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements SaveCategoryPort, LoadCategoryPort, DeleteCategoryPort {

    private final CategoryJpaRepository categoryJpaRepository;

    @Override
    public Long save(AdminCategory category) {
        return categoryJpaRepository.save(category).getId();
    }

    @Override
    public List<AdminCategory> findAll() {
        return categoryJpaRepository.findAllByOrderBySortOrderAsc();
    }

    @Override
    public Optional<AdminCategory> findById(Long id) {
        return categoryJpaRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        categoryJpaRepository.deleteById(id);
    }
}
