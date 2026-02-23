package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import java.util.List;
import java.util.Optional;

public interface LoadAdminMenuPort {
    List<AdminMenu> findAll(Long categoryId, String searchQuery);
    Optional<AdminMenu> findById(Long id);
}
