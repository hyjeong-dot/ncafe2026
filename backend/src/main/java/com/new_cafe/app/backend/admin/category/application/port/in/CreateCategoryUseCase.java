package com.new_cafe.app.backend.admin.category.application.port.in;

import com.new_cafe.app.backend.admin.category.application.command.CreateCategoryCommand;

public interface CreateCategoryUseCase {
    Long createCategory(CreateCategoryCommand command);
}
