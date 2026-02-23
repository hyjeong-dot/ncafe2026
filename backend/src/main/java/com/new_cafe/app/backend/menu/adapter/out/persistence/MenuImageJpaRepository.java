package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuImageJpaRepository extends JpaRepository<MenuImage, Long> {
    List<MenuImage> findAllByMenuIdOrderBySortOrderAsc(Long menuId);
}
