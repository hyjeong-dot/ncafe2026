package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository("menuPersistenceAdapter")
public class MenuPersistenceAdapter implements LoadMenuPort, SaveMenuPort, DeleteMenuPort {

    private final JdbcTemplate jdbcTemplate;

    public MenuPersistenceAdapter(JdbcTemplate jdbcTemplate) {
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
    public List<Menu> findAll() {
        String sql = "SELECT * FROM menus ORDER BY sort_order ASC";
        return jdbcTemplate.query(sql, menuRowMapper);
    }

    @Override
    public List<Menu> findAllByCategoryId(Long categoryId) {
        if (categoryId == null) return findAll();
        String sql = "SELECT * FROM menus WHERE category_id = ? ORDER BY sort_order ASC";
        return jdbcTemplate.query(sql, menuRowMapper, categoryId);
    }

    @Override
    public List<Menu> findAllByCategoryIdAndSearchQuery(Long categoryId, String searchQuery) {
        StringBuilder sql = new StringBuilder("SELECT * FROM menus WHERE 1=1");
        if (categoryId != null) {
            sql.append(" AND category_id = ").append(categoryId);
        }
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            sql.append(" AND (kor_name LIKE '%").append(searchQuery).append("%' OR eng_name LIKE '%").append(searchQuery).append("%')");
        }
        sql.append(" ORDER BY sort_order ASC");
        return jdbcTemplate.query(sql.toString(), menuRowMapper);
    }

    @Override
    public Optional<Menu> findById(Long id) {
        String sql = "SELECT * FROM menus WHERE id = ?";
        List<Menu> menus = jdbcTemplate.query(sql, menuRowMapper, id);
        return menus.stream().findFirst();
    }

    @Override
    public Long save(Menu menu) {
        if (menu.getId() == null) {
            String sql = "INSERT INTO menus (kor_name, eng_name, description, price, category_id, is_available, is_sold_out, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, menu.getKorName());
                ps.setString(2, menu.getEngName());
                ps.setString(3, menu.getDescription());
                ps.setInt(4, menu.getPrice());
                ps.setObject(5, menu.getCategoryId());
                ps.setBoolean(6, menu.getIsAvailable() != null ? menu.getIsAvailable() : true);
                ps.setBoolean(7, menu.getIsSoldOut() != null ? menu.getIsSoldOut() : false);
                ps.setInt(8, menu.getSortOrder() != null ? menu.getSortOrder() : 0);
                return ps;
            }, keyHolder);
            Number key = keyHolder.getKey();
            return key != null ? key.longValue() : null;
        } else {
            String sql = "UPDATE menus SET kor_name = ?, eng_name = ?, description = ?, price = ?, category_id = ?, is_available = ?, is_sold_out = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            jdbcTemplate.update(sql,
                    menu.getKorName(),
                    menu.getEngName(),
                    menu.getDescription(),
                    menu.getPrice(),
                    menu.getCategoryId(),
                    menu.getIsAvailable(),
                    menu.getIsSoldOut(),
                    menu.getSortOrder(),
                    menu.getId());
            return menu.getId();
        }
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM menus WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
