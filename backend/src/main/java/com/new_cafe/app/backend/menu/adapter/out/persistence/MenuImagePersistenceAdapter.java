package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * 메뉴 이미지 영속성 어댑터 (Output Adapter)
 */
@Repository("menuLoadMenuImagePort")
public class MenuImagePersistenceAdapter implements LoadMenuImagePort {

    private final DataSource dataSource;

    public MenuImagePersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        List<MenuImage> images = new ArrayList<>();
        String sql = "SELECT * FROM menu_images WHERE menu_id = ? ORDER BY sort_order ASC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, menuId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    MenuImage image = MenuImage.builder()
                            .id(rs.getLong("id"))
                            .menuId(rs.getLong("menu_id"))
                            .srcUrl(rs.getString("src_url"))
                            .sortOrder(rs.getInt("sort_order"))
                            .createdAt(rs.getTimestamp("created_at") != null
                                    ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                            .build();
                    images.add(image);
                }
            }
        } catch (SQLException e) {
            System.err.println("MenuImage findAllByMenuId error: " + e.getMessage());
        }
        return images;
    }
}
