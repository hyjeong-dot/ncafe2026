package com.new_cafe.app.backend.repository;

import java.util.List;

import com.new_cafe.app.backend.entity.Menu;

public interface MenuRepository {

    List<Menu> findAll() throws java.sql.SQLException, ClassNotFoundException;

    List<Menu> findAllByName(String name) throws java.sql.SQLException, ClassNotFoundException;
}
