package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenuImage;
import com.new_cafe.app.backend.global.file.application.port.in.DeleteFileUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * 메뉴 삭제 전용 서비스
 * - 메뉴 정보 삭제와 동시에 연관된 물리 이미지 파일도 삭제합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DeleteMenuService implements DeleteMenuUseCase {

    private final DeleteMenuPort deleteMenuPort;
    private final MenuImagePort menuImagePort;
    private final DeleteFileUseCase deleteFileUseCase;

    @Override
    public void deleteMenu(Long id) {
        // 1. 연관된 이미지 정보 조회
        List<AdminMenuImage> images = menuImagePort.findAllByMenuId(id);
        
        // 2. 물리 파일 삭제 (예외가 발생해도 트랜잭션 전체가 롤백되지 않도록 개별 처리 유의 - 현재는 단순 처리)
        for (AdminMenuImage image : images) {
            deleteFileUseCase.deleteFile(image.getSrcUrl());
        }
        
        // 3. 이미지 정보(DB) 삭제
        menuImagePort.deleteByMenuId(id);
        
        // 4. 메뉴 정보 삭제
        deleteMenuPort.deleteById(id);
        
        System.out.println("DEBUG: Menu and associated images deleted for ID: " + id);
    }
}
