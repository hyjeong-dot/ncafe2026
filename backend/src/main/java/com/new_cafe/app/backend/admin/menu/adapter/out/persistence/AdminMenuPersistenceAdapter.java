package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AdminMenuPersistenceAdapter implements SaveAdminMenuPort, LoadAdminMenuPort, DeleteAdminMenuPort {

    private final AdminMenuRepository adminMenuRepository;

    @Override
    public Long saveAdminMenu(AdminMenu menu) {
        return adminMenuRepository.save(menu).getId();
    }

    @Override
    public List<AdminMenu> findAll(Long categoryId, String searchQuery) {
        return adminMenuRepository.findAllByFilter(categoryId, searchQuery);
    }

    @Override
    public Optional<AdminMenu> findById(Long id) {
        return adminMenuRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        adminMenuRepository.deleteById(id);
    }
}
