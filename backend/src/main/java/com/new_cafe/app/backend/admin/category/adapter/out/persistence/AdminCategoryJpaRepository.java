package com.new_cafe.app.backend.admin.category.adapter.out.persistence;

import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface AdminCategoryJpaRepository extends JpaRepository<AdminCategory, Long> {
    List<AdminCategory> findAllByOrderBySortOrderAsc();
    Optional<AdminCategory> findByName(String name);
}
