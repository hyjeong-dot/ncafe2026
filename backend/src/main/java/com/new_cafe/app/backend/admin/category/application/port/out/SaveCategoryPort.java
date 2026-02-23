package com.new_cafe.app.backend.admin.category.application.port.out;

import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;

public interface SaveCategoryPort {
    Long save(AdminCategory category);
}
