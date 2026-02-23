package com.new_cafe.app.backend.category.application.port.in;

import com.new_cafe.app.backend.category.application.result.CategoryListResult;

public interface GetCategoryListUseCase {
    CategoryListResult getAllCategories();
}
