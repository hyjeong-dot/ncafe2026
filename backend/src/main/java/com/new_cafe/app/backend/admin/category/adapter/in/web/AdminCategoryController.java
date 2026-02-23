package com.new_cafe.app.backend.admin.category.adapter.in.web;

import com.new_cafe.app.backend.admin.category.adapter.in.web.dto.CreateCategoryRequest;
import com.new_cafe.app.backend.admin.category.adapter.in.web.dto.UpdateCategoryRequest;
import com.new_cafe.app.backend.admin.category.application.port.in.CreateCategoryUseCase;
import com.new_cafe.app.backend.admin.category.application.port.in.DeleteCategoryUseCase;
import com.new_cafe.app.backend.admin.category.application.port.in.GetCategoryListUseCase;
import com.new_cafe.app.backend.admin.category.application.port.in.UpdateCategoryUseCase;
import com.new_cafe.app.backend.admin.category.application.result.CategoryListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CreateCategoryUseCase createCategoryUseCase;
    private final GetCategoryListUseCase getCategoryListUseCase;
    private final UpdateCategoryUseCase updateCategoryUseCase;
    private final DeleteCategoryUseCase deleteCategoryUseCase;

    @GetMapping
    public CategoryListResult getCategories() {
        return getCategoryListUseCase.getCategories();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long createCategory(@RequestBody CreateCategoryRequest request) {
        return createCategoryUseCase.createCategory(request.toCommand());
    }

    @PutMapping("/{id}")
    public void updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryRequest request) {
        updateCategoryUseCase.updateCategory(request.toCommand(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        deleteCategoryUseCase.deleteCategory(id);
    }
}
