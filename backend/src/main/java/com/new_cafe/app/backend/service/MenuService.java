package com.new_cafe.app.backend.service;

import java.util.List;

import com.new_cafe.app.backend.entity.Menu;

public interface MenuService {
    List<Menu> getAll();

    List<Menu> getAll(Integer categoryId);
}
