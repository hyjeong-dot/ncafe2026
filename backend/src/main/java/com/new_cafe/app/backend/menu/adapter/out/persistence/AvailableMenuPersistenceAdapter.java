package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.application.port.out.LoadAvailableMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AvailableMenuPersistenceAdapter implements LoadAvailableMenuPort {

    private final JdbcTemplate jdbcTemplate;

    public AvailableMenuPersistenceAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Menu> menuRowMapper = (rs, rowNum) -> Menu.builder()
            .id(rs.getLong("id"))
            .korName(rs.getString("kor_name"))
            .engName(rs.getString("eng_name"))
            .price(rs.getInt("price"))
            .description(rs.getString("description"))
            .categoryId(rs.getLong("category_id"))
            .isAvailable(rs.getBoolean("is_available"))
            .isSoldOut(rs.getBoolean("is_sold_out"))
            .sortOrder(rs.getInt("sort_order"))
            .createdAt(rs.getTimestamp("created_at") != null
                    ? rs.getTimestamp("created_at").toLocalDateTime() : null)
            .updatedAt(rs.getTimestamp("updated_at") != null
                    ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
            .build();

    @Override
    public List<Menu> findAvailableByCategoryId(Long categoryId) {
        if (categoryId != null) {
            String sql = "SELECT * FROM menus WHERE is_available = true AND category_id = ? ORDER BY sort_order ASC";
            return jdbcTemplate.query(sql, menuRowMapper, categoryId);
        } else {
            String sql = "SELECT * FROM menus WHERE is_available = true ORDER BY sort_order ASC";
            return jdbcTemplate.query(sql, menuRowMapper);
        }
    }

    @Override
    public Optional<Menu> findAvailableById(Long id) {
        String sql = "SELECT * FROM menus WHERE id = ? AND is_available = true";
        List<Menu> menus = jdbcTemplate.query(sql, menuRowMapper, id);
        return menus.stream().findFirst();
    }
}
