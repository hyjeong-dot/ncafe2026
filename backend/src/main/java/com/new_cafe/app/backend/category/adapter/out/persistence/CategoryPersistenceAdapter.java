package com.new_cafe.app.backend.category.adapter.out.persistence;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("categoryPersistenceAdapter")
public class CategoryPersistenceAdapter implements LoadCategoryPort {

    private final JdbcTemplate jdbcTemplate;

    public CategoryPersistenceAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> categoryRowMapper = (rs, rowNum) -> Category.builder()
            .id(rs.getLong("id"))
            .name(rs.getString("name"))
            .icon(rs.getString("icon"))
            .sortOrder(rs.getInt("sort_order"))
            .build();

    @Override
    public List<Category> findAll() {
        String sql = "SELECT * FROM categories ORDER BY sort_order ASC";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    @Override
    public Optional<Category> findById(Long id) {
        String sql = "SELECT * FROM categories WHERE id = ?";
        List<Category> categories = jdbcTemplate.query(sql, categoryRowMapper, id);
        return categories.stream().findFirst();
    }
}
