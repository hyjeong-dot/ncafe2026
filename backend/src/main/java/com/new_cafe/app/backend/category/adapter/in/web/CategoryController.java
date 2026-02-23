package com.new_cafe.app.backend.category.adapter.in.web;

import com.new_cafe.app.backend.category.application.port.in.GetCategoryListUseCase;
import com.new_cafe.app.backend.category.application.result.CategoryListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 사용자용 카테고리 조회 컨트롤러 (Input Adapter)
 * - /categories 경로를 사용하며, 활성화된 카테고리 목록만 노출합니다.
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final GetCategoryListUseCase getCategoryListUseCase;

    /**
     * 활성화된 카테고리 목록 조회
     */
    @GetMapping
    public CategoryListResult getCategories() {
        return getCategoryListUseCase.getAllCategories();
    }
}
