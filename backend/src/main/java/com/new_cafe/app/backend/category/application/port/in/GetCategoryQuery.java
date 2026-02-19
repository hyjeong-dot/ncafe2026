package com.new_cafe.app.backend.category.application.port.in;

import com.new_cafe.app.backend.category.domain.model.Category;
import java.util.List;

public interface GetCategoryQuery {
    List<Category> getAllCategories();
    Category getCategory(Long id);
}
