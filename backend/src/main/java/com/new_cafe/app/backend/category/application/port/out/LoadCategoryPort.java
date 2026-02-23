package com.new_cafe.app.backend.category.application.port.out;

import com.new_cafe.app.backend.category.domain.model.Category;
import java.util.List;
import java.util.Optional;

public interface LoadCategoryPort {
    List<Category> findAllActive();
    Optional<Category> findById(Long id);
}
