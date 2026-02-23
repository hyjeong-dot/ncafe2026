package com.new_cafe.app.backend.admin.category.application.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCategoryCommand {
    private final String name;
    private final String icon;
    private final Integer sortOrder;
    private final Boolean isActive;
}
