package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메뉴 삭제 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DeleteMenuService implements DeleteMenuUseCase {

    private final DeleteMenuPort deleteMenuPort;

    @Override
    public void deleteMenu(Long id) {
        deleteMenuPort.deleteById(id);
    }
}
