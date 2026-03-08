package com.new_cafe.app.backend.menu.application.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class MenuDetailResult {
    private final Long id;
    private final String korName;
    private final String engName;
    private final String description;
    private final int price;
    private final String categoryName;
    private final String categoryIcon;
    private final String imageSrc;
    private final Boolean isSoldOut;
    private final Boolean isAvailable;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
