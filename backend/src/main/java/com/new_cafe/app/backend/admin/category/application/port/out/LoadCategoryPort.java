package com.new_cafe.app.backend.admin.category.application.port.out;

import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import java.util.List;
import java.util.Optional;

public interface LoadCategoryPort {
    List<AdminCategory> findAll();
    Optional<AdminCategory> findById(Long id);
}
