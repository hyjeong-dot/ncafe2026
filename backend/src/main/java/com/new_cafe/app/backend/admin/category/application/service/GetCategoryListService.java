package com.new_cafe.app.backend.admin.category.application.service;

import com.new_cafe.app.backend.admin.category.application.port.in.GetCategoryListUseCase;
import com.new_cafe.app.backend.admin.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.admin.category.application.result.CategoryListResult;
import com.new_cafe.app.backend.admin.category.application.result.CategoryResult;
import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service("adminGetCategoryListService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetCategoryListService implements GetCategoryListUseCase {

    private final LoadCategoryPort loadCategoryPort;

    @Override
    public CategoryListResult getCategories() {
        List<AdminCategory> categories = loadCategoryPort.findAll();

        List<CategoryResult> results = categories.stream()
                .map(c -> CategoryResult.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .icon(c.getIcon())
                        .sortOrder(c.getSortOrder())
                        .isActive(c.getIsActive())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return CategoryListResult.builder()
                .categories(results)
                .count(results.size())
                .build();
    }
}
