package com.new_cafe.app.backend.admin.category.application.port.in;

import com.new_cafe.app.backend.admin.category.application.result.CategoryListResult;

public interface GetCategoryListUseCase {
    CategoryListResult getCategories();
}
