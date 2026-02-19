package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.service.CategoryService;

// @RestController  // → menu 헥사고날 아키텍처로 이관됨 (AdminMenuController)
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 카테고리 목록 조회
    @GetMapping("/admin/categories")
    public List<Category> list() {
        return categoryService.getAll();
    }

    // 카테고리 상세 조회
    @GetMapping("/admin/categories/{id}")
    public Category detail(@PathVariable("id") Long id) {
        return categoryService.getById(id);
    }

    // 카테고리 생성 데이터 입력
    @PostMapping("/admin/categories")
    public String newCategory(Category category) {
        return "newCategory";
    }

    // 카테고리 수정
    @PutMapping("/admin/categories/{id}")
    public String editCategory(Category category) {
        return "editCategory";
    }

    // 카테고리 삭제
    @DeleteMapping("/admin/categories/{id}")
    public String deleteCategory() {
        return "deleteCategory";
    }

}
