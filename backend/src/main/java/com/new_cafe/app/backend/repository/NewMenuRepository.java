package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.new_cafe.app.backend.entity.Menu;

// @Component
public class NewMenuRepository implements MenuRepository {
    @Override
    public List<Menu> findAll() throws SQLException, ClassNotFoundException {
        // DB 데이터
        List<Menu> menus = new ArrayList<>();

        String sql = "SELECT * FROM menus";

        // API에게 이거 sql 문장 실행해줘 재생버튼을 코드로 어떻게 하지??

        // 0. 드라이버 로드
        Class.forName("org.postgresql.Driver");

        try (
                // 1. 연결
                Connection conn = DriverManager.getConnection(
                        "jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
                        "postgres.cxtknpbuezwgsfyjqqtl", "ibmhyjeong96");
                // 2. 실행
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {
            // 3. 결과
            while (rs.next()) {
                Menu menu = new Menu();
                menu.setId(rs.getLong("id"));
                menu.setKorName(rs.getString("kor_name"));
                menu.setEngName(rs.getString("eng_name"));
                menu.setPrice(rs.getInt("price"));
                menu.setCategory(rs.getInt("category_id"));
                menus.add(menu);

                System.out.println(menu);
            }
        }

        return menus;

    }
}
