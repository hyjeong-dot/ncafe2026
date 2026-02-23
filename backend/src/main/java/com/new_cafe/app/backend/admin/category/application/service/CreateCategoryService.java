package com.new_cafe.app.backend.admin.category.application.service;

import com.new_cafe.app.backend.admin.category.application.command.CreateCategoryCommand;
import com.new_cafe.app.backend.admin.category.application.port.in.CreateCategoryUseCase;
import com.new_cafe.app.backend.admin.category.application.port.out.SaveCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateCategoryService implements CreateCategoryUseCase {

    private final SaveCategoryPort saveCategoryPort;

    @Override
    public Long createCategory(CreateCategoryCommand command) {
        AdminCategory category = AdminCategory.builder()
                .name(command.getName())
                .icon(command.getIcon())
                .sortOrder(command.getSortOrder())
                .isActive(command.getIsActive())
                .build();

        return saveCategoryPort.save(category);
    }
}
