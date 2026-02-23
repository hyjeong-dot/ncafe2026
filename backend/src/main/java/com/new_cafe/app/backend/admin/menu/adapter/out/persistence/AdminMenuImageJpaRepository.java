package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminMenuImageJpaRepository extends JpaRepository<AdminMenuImage, Long> {
    List<AdminMenuImage> findAllByMenuIdOrderBySortOrderAsc(Long menuId);
}
