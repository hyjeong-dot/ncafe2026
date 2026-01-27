package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.entity.Menu;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.new_cafe.app.backend.service.MenuService;

@RestController
public class MenuController {

    @Autowired
    private MenuService menuService;

    // 목록 조회 데이터 반환
    @GetMapping("/admin/menus")
    public List<Menu> menu(@RequestParam(name = "cid", required = false) Integer categoryId) {
        System.out.println("category :" + categoryId);
        // menuService = new NewMenuService();
        return menuService.getAll(categoryId);
    }

    // 상세 조회 데이터 반환
    @GetMapping("/admin/menus/{id}")
    public String editMenu() {
        return "editMenu";
    }

    // 메뉴 생성 데이터 입력
    @PostMapping("/admin/menus")
    public String newMenu(Menu menu) {
        return "newMenu";
    }

    @PutMapping("path/{id}")
    public String editMenu(Menu menu) {
        return "editMenu";
    }

    // 메뉴 삭제 데이터 입력
    @DeleteMapping("/admin/menus/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }
}
