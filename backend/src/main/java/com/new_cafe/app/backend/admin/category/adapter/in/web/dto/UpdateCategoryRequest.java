package com.new_cafe.app.backend.admin.category.adapter.in.web.dto;

import com.new_cafe.app.backend.admin.category.application.command.UpdateCategoryCommand;
import lombok.Data;

@Data
public class UpdateCategoryRequest {
    private String name;
    private String icon;
    private Integer sortOrder;
    private Boolean isActive;

    public UpdateCategoryCommand toCommand(Long id) {
        return UpdateCategoryCommand.builder()
                .id(id)
                .name(name)
                .icon(icon)
                .sortOrder(sortOrder)
                .isActive(isActive)
                .build();
    }
}
