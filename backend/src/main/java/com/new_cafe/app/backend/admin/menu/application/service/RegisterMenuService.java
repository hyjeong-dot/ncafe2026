package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.RegisterMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메뉴 등록 전용 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RegisterMenuService implements RegisterMenuUseCase {

    private final SaveMenuPort saveMenuPort;
    private final LoadMenuPort loadMenuPort;

    @Override
    public Long registerMenu(RegisterMenuCommand command) {
        if (command.getPrice() < 1000 || command.getPrice() > 50000) {
            throw new IllegalArgumentException("메뉴 가격은 1,000원 이상 50,000원 이하로 설정해야 합니다.");
        }

        String slug = generateUniqueSlug(command.getEngName());

        Menu menu = Menu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .slug(slug)
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.getIsAvailable())
                .sortOrder(command.getSortOrder())
                .build();

        return saveMenuPort.save(menu);
    }

    /**
     * 유일한 slug를 생성합니다.
     * 중복 시 suffix(-2, -3, ...)를 붙입니다.
     */
    private String generateUniqueSlug(String engName) {
        String baseSlug = Menu.generateSlug(engName);
        if (baseSlug == null) return null;

        if (!loadMenuPort.existsBySlug(baseSlug)) {
            return baseSlug;
        }

        // 중복 발생 시 suffix 추가
        long count = loadMenuPort.countBySlugStartingWith(baseSlug);
        String candidateSlug;
        do {
            count++;
            candidateSlug = baseSlug + "-" + count;
        } while (loadMenuPort.existsBySlug(candidateSlug));

        return candidateSlug;
    }
}
