package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.menu.application.port.in.GetMenuImageListUseCase;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.application.result.MenuImageListResult;
import com.new_cafe.app.backend.menu.application.result.MenuImageResult;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuImageListService implements GetMenuImageListUseCase {

    private final LoadMenuPort loadMenuPort;
    private final LoadMenuImagePort loadMenuImagePort;

    @Override
    public MenuImageListResult getMenuImages(Long menuId) {
        Menu menu = loadMenuPort.findAvailableById(menuId)
                .orElseThrow(() -> new MenuNotFoundException(menuId));

        List<MenuImage> images = loadMenuImagePort.findAllByMenuId(menuId);

        List<MenuImageResult> results = images.stream()
                .map(img -> MenuImageResult.builder()
                        .id(img.getId())
                        .menuId(img.getMenuId())
                        .srcUrl(img.getSrcUrl())
                        .altText(menu.getKorName())
                        .sortOrder(img.getSortOrder() != null ? img.getSortOrder() : 0)
                        .build())
                .collect(Collectors.toList());

        return MenuImageListResult.builder()
                .images(results)
                .build();
    }
}
