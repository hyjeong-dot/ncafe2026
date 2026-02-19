package com.new_cafe.app.backend.category.application.service;

import com.new_cafe.app.backend.category.application.port.in.GetCategoryQuery;
import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryQueryService implements GetCategoryQuery {

    private final LoadCategoryPort loadCategoryPort;

    public CategoryQueryService(LoadCategoryPort loadCategoryPort) {
        this.loadCategoryPort = loadCategoryPort;
    }

    @Override
    public List<Category> getAllCategories() {
        return loadCategoryPort.findAll();
    }

    @Override
    public Category getCategory(Long id) {
        return loadCategoryPort.findById(id).orElse(null);
    }
}
