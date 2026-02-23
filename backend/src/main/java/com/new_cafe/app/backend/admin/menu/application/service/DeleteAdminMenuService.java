package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteAdminMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteAdminMenuPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteAdminMenuService implements DeleteAdminMenuUseCase {

    private final DeleteAdminMenuPort deleteAdminMenuPort;

    @Override
    public void deleteMenu(Long id) {
        deleteAdminMenuPort.deleteById(id);
    }
}
