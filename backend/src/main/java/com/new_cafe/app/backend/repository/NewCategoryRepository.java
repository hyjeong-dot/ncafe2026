package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.Category;

// @Repository // → menu 헥사고날 아키텍처로 이관됨 (CategoryPersistenceAdapter)
public class NewCategoryRepository implements CategoryRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<Category> findAll() {
        List<Category> categories = new ArrayList<>();
        String sql = "SELECT * FROM categories ORDER BY sort_order ASC";

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                // Category category = new Category();
                // category.setId(rs.getInt("id"));
                // category.setName(rs.getString("name"));
                // category.setIcon(rs.getString("icon"));
                // category.setSortOrder(rs.getInt("sort_order"));
                Category category = Category.builder()
                        .id(rs.getLong("id"))
                        .name(rs.getString("name"))
                        .icon(rs.getString("icon"))
                        .sortOrder(rs.getInt("sort_order"))
                        .build();
                categories.add(category);
            }
        } catch (SQLException e) {
            System.err.println("Category findAll error: " + e.getMessage());
            e.printStackTrace();
        }

        return categories;
    }

    @Override
    public Category findById(Long id) {
        String sql = "SELECT * FROM categories WHERE id = " + id;

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                // Category category = new Category();
                // category.setId(rs.getInt("id"));
                // category.setName(rs.getString("name"));
                // category.setIcon(rs.getString("icon"));
                // category.setSortOrder(rs.getInt("sort_order"));
                Category category = Category.builder()
                        .id(rs.getLong("id"))
                        .name(rs.getString("name"))
                        .icon(rs.getString("icon"))
                        .sortOrder(rs.getInt("sort_order"))
                        .build();
                return category;
            }
        } catch (SQLException e) {
            System.err.println("Category findById error: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
