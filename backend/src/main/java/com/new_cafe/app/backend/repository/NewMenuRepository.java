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

import com.new_cafe.app.backend.entity.Menu;

@Repository
public class NewMenuRepository implements MenuRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<Menu> findAll() {
        List<Menu> menus = new ArrayList<>();
        String sql = "SELECT * FROM menus";

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Menu menu = new Menu();
                menu.setId(rs.getLong("id"));
                menu.setKorName(rs.getString("kor_name"));
                menu.setEngName(rs.getString("eng_name"));
                menu.setPrice(rs.getInt("price"));
                menu.setDescription(rs.getString("description"));
                menu.setCategory(rs.getInt("category_id"));
                menus.add(menu);
            }
        } catch (SQLException e) {
            System.err.println("Menu findAll error: " + e.getMessage());
            e.printStackTrace();
        }
        return menus;
    }

    @Override
    public List<Menu> findAllByName(String name) {
        List<Menu> menus = new ArrayList<>();
        String sql = "SELECT * FROM menus WHERE kor_name LIKE '%" + name + "%'";

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Menu menu = new Menu();
                menu.setId(rs.getLong("id"));
                menu.setKorName(rs.getString("kor_name"));
                menu.setEngName(rs.getString("eng_name"));
                menu.setPrice(rs.getInt("price"));
                menu.setDescription(rs.getString("description"));
                menu.setCategory(rs.getInt("category_id"));
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
        String sql = "SELECT * FROM menus";
        if (categoryId != null) {
            sql += " WHERE category_id = " + categoryId;
        }

        try (
                Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Menu menu = new Menu();
                menu.setId(rs.getLong("id"));
                menu.setKorName(rs.getString("kor_name"));
                menu.setEngName(rs.getString("eng_name"));
                menu.setPrice(rs.getInt("price"));
                menu.setDescription(rs.getString("description"));
                menu.setCategory(rs.getInt("category_id"));
                menus.add(menu);
            }
        } catch (SQLException e) {
            System.err.println("Menu findAllByCategoryId error: " + e.getMessage());
            e.printStackTrace();
        }
        return menus;
    }
}
