package com.new_cafe.app.backend.admin.category.adapter.out.persistence;

import com.new_cafe.app.backend.admin.category.domain.model.AdminCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryJpaRepository extends JpaRepository<AdminCategory, Long> {
    List<AdminCategory> findAllByOrderBySortOrderAsc();
}
