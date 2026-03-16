package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메뉴 수정 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UpdateMenuService implements UpdateMenuUseCase {

    private final LoadMenuPort loadMenuPort;
    private final SaveMenuPort saveMenuPort;

    @Override
    public void updateMenu(UpdateMenuCommand command) {
        if (command.getPrice() < 1000 || command.getPrice() > 50000) {
            throw new IllegalArgumentException("메뉴 가격은 1,000원 이상 50,000원 이하로 설정해야 합니다.");
        }

        Menu menu = loadMenuPort.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + command.getId()));

        menu.setKorName(command.getKorName());
        menu.setEngName(command.getEngName());
        menu.setDescription(command.getDescription());
        menu.setPrice(command.getPrice());
        menu.setCategoryId(command.getCategoryId());
        menu.setIsAvailable(command.getIsAvailable());
        menu.setIsSoldOut(command.getIsSoldOut());
        menu.setSortOrder(command.getSortOrder());

        // slug가 아직 없으면 자동 생성 (이미 있으면 변경하지 않음 — URL 안정성)
        if (menu.getSlug() == null && command.getEngName() != null) {
            menu.setSlug(generateUniqueSlug(command.getEngName()));
        }

        saveMenuPort.save(menu);
    }

    /**
     * 유일한 slug 생성 (중복 시 suffix 추가)
     */
    private String generateUniqueSlug(String engName) {
        String baseSlug = Menu.generateSlug(engName);
        if (baseSlug == null) return null;

        if (!loadMenuPort.existsBySlug(baseSlug)) {
            return baseSlug;
        }

        long count = loadMenuPort.countBySlugStartingWith(baseSlug);
        String candidateSlug;
        do {
            count++;
            candidateSlug = baseSlug + "-" + count;
        } while (loadMenuPort.existsBySlug(candidateSlug));

        return candidateSlug;
    }

    @Override
    public void toggleSoldOut(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. ID: " + id));
        menu.setIsSoldOut(!menu.getIsSoldOut());
        saveMenuPort.save(menu);
    }
}
