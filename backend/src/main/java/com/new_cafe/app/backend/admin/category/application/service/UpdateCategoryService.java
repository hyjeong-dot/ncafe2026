package com.new_cafe.app.backend.admin.category.application.service;

import com.new_cafe.app.backend.admin.category.application.command.UpdateCategoryCommand;
import com.new_cafe.app.backend.admin.category.application.port.in.UpdateCategoryUseCase;
import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.application.port.out.SaveCategoryPort;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateCategoryService implements UpdateCategoryUseCase {

    private final LoadCategoryPort loadCategoryPort;
    private final SaveCategoryPort saveCategoryPort;

    @Override
    public void updateCategory(UpdateCategoryCommand command) {
        AdminCategory category = loadCategoryPort.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다. ID: " + command.getId()));

        category.updateInfo(command.getName(), command.getIcon(), command.getSortOrder(), command.getIsActive());
        saveCategoryPort.save(category);
    }
}
