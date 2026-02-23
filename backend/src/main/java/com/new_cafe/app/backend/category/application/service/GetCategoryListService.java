package com.new_cafe.app.backend.category.application.service;

import com.new_cafe.app.backend.category.application.port.in.GetCategoryListUseCase;
import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.application.result.CategoryListResult;
import com.new_cafe.app.backend.category.application.result.CategoryResult;
import com.new_cafe.app.backend.category.domain.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service("publicGetCategoryListService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetCategoryListService implements GetCategoryListUseCase {

    private final LoadCategoryPort loadCategoryPort;

    @Override
    public CategoryListResult getAllCategories() {
        List<Category> categories = loadCategoryPort.findAllActive();

        List<CategoryResult> results = categories.stream()
                .map(c -> CategoryResult.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .icon(c.getIcon())
                        .sortOrder(c.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        return CategoryListResult.builder()
                .categories(results)
                .count(results.size())
                .build();
    }
}
