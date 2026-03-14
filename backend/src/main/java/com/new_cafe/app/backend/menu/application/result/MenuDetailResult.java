package com.new_cafe.app.backend.menu.application.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MenuDetailResult {
    private final Long id;
    private final String slug;
    private final String korName;
    private final String engName;
    private final String description;
    private final int price;
    private final String categoryName;
    private final String categoryIcon;
    private final String imageSrc;
    private final Boolean isSoldOut;
    private final Boolean isAvailable;
    private final List<MenuOptionResult> options;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
