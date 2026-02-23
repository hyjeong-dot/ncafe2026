package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.GetAdminMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAdminMenuListService implements GetAdminMenuListUseCase {

    private final LoadAdminMenuPort loadAdminMenuPort;
    // 나중에 CategoryPort, MenuImagePort가 준비되면 주입받아 조합 로직 구현

    @Override
    public AdminMenuListResponse getAdminMenus(Long categoryId, String searchQuery) {
        List<AdminMenu> menus = loadAdminMenuPort.findAll(categoryId, searchQuery);

        List<AdminMenuResponse> menuResponses = menus.stream()
                .map(menu -> AdminMenuResponse.builder()
                        .id(menu.getId())
                        .korName(menu.getKorName())
                        .engName(menu.getEngName())
                        .description(menu.getDescription())
                        .price(menu.getPrice())
                        .isAvailable(menu.getIsAvailable())
                        .isSoldOut(menu.getIsSoldOut())
                        .sortOrder(menu.getSortOrder())
                        .createdAt(menu.getCreatedAt())
                        .updatedAt(menu.getUpdatedAt())
                        // 기획대로 Category와 Image 조합 로직은 별도 포트 주입 후 완성
                        .categoryName("미구현") 
                        .categoryIcon("")
                        .imageSrc("blank.png")
                        .build())
                .collect(Collectors.toList());

        return AdminMenuListResponse.builder()
                .menus(menuResponses)
                .menuCount(menuResponses.size())
                .build();
    }
}
