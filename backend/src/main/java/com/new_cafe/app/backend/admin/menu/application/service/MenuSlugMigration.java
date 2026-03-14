package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 서버 시작 시 slug가 없는 기존 메뉴에 slug를 자동 생성합니다.
 * 한번 실행되면 더 이상 할 일이 없으므로 성능에 영향 없습니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MenuSlugMigration {

    private final LoadMenuPort loadMenuPort;
    private final SaveMenuPort saveMenuPort;

    @PostConstruct
    @Transactional
    public void migrateNullSlugs() {
        List<Menu> menusWithoutSlug = loadMenuPort.findAllBySlugIsNull();

        if (menusWithoutSlug.isEmpty()) {
            log.info("[SlugMigration] 모든 메뉴에 slug가 설정되어 있습니다.");
            return;
        }

        log.info("[SlugMigration] slug가 없는 메뉴 {}건 발견. 자동 생성 시작...", menusWithoutSlug.size());

        for (Menu menu : menusWithoutSlug) {
            String baseSlug = Menu.generateSlug(menu.getEngName());
            if (baseSlug == null) {
                // engName이 없으면 korName 기반으로 id를 사용
                baseSlug = "menu-" + menu.getId();
            }

            String slug = baseSlug;
            if (loadMenuPort.existsBySlug(slug)) {
                long count = loadMenuPort.countBySlugStartingWith(baseSlug);
                do {
                    count++;
                    slug = baseSlug + "-" + count;
                } while (loadMenuPort.existsBySlug(slug));
            }

            menu.setSlug(slug);
            saveMenuPort.save(menu);
            log.info("[SlugMigration] 메뉴 '{}' (ID:{}) → slug: '{}'", menu.getKorName(), menu.getId(), slug);
        }

        log.info("[SlugMigration] slug 마이그레이션 완료.");
    }
}
