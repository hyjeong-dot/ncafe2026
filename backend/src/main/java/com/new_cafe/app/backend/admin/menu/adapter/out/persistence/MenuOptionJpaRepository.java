package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuOptionJpaRepository extends JpaRepository<MenuOption, Long> {
    List<MenuOption> findAllByMenuIdOrderBySortOrderAsc(Long menuId);
    void deleteByMenuId(Long menuId);
}
