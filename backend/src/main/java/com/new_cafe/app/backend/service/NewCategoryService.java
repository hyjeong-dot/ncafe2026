package com.new_cafe.app.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.repository.CategoryRepository;

// @Service // → menu 헥사고날 아키텍처로 이관됨 (MenuQueryService)
public class NewCategoryService implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id);
    }

}
