package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.Menu;

@Repository
public class NewMenuRepository implements MenuRepository {

    private DataSource dataSource;

    public NewMenuRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Menu> findAll() {
        return findAllByCategoryId(null);
    }

    @Override
    public List<Menu> findAllByName(String name) {
        List<Menu> menus = new ArrayList<>();
        String sql = "SELECT m.*, (SELECT src_url FROM menu_images mi WHERE mi.menu_id = m.id ORDER BY mi.sort_order ASC LIMIT 1) as image_url FROM menus m WHERE m.kor_name LIKE '%"
                + name + "%'";

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Menu menu = Menu.builder()
                        .id(rs.getLong("id"))
                        .korName(rs.getString("kor_name"))
                        .engName(rs.getString("eng_name"))
                        .price(rs.getInt("price"))
                        .description(rs.getString("description"))
                        .image(rs.getString("image_url"))
                        .categoryId(rs.getInt("category_id"))
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
                menus.add(menu);
            }
        } catch (SQLException e) {
            System.err.println("Menu findAllByName error: " + e.getMessage());
            e.printStackTrace();
        }
        return menus;
    }

    @Override
    public List<Menu> findAllByCategoryId(Integer categoryId) {
        List<Menu> menus = new ArrayList<>();
        String sql = "SELECT m.*, (SELECT src_url FROM menu_images mi WHERE mi.menu_id = m.id ORDER BY mi.sort_order ASC LIMIT 1) as image_url FROM menus m";
        if (categoryId != null) {
            sql += " WHERE m.category_id = " + categoryId;
        }

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Menu menu = Menu.builder()
                        .id(rs.getLong("id"))
                        .korName(rs.getString("kor_name"))
                        .engName(rs.getString("eng_name"))
                        .price(rs.getInt("price"))
                        .description(rs.getString("description"))
                        .image(rs.getString("image_url"))
                        .categoryId(rs.getInt("category_id"))
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
                menus.add(menu);
            }
        } catch (SQLException e) {
            System.err.println("Menu findAllByCategoryId error: " + e.getMessage());
            e.printStackTrace();
        }
        return menus;
    }
    @Override
    public List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery) {
        List<Menu> menus = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT m.*, (SELECT src_url FROM menu_images mi WHERE mi.menu_id = m.id ORDER BY mi.sort_order ASC LIMIT 1) as image_url FROM menus m WHERE 1=1");

        if (categoryId != null) {
            sql.append(" AND m.category_id = ").append(categoryId);
        }
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            sql.append(" AND m.kor_name LIKE '%").append(searchQuery).append("%'");
        }

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql.toString())) {
            while (rs.next()) {
                Menu menu = Menu.builder()
                        .id(rs.getLong("id"))
                        .korName(rs.getString("kor_name"))
                        .engName(rs.getString("eng_name"))
                        .price(rs.getInt("price"))
                        .description(rs.getString("description"))
                        .image(rs.getString("image_url"))
                        .categoryId(rs.getInt("category_id"))
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
                menus.add(menu);
            }
        } catch (SQLException e) {
            System.err.println("Menu findAllByCategoryIdAndSearchQuery error: " + e.getMessage());
            e.printStackTrace();
        }
        return menus;
    }
}
