package com.new_cafe.app.backend.admin.category.application.result;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CategoryResult {
    private final Long id;
    private final String name;
    private final String icon;
    private final Integer sortOrder;
    private final Boolean isActive;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
