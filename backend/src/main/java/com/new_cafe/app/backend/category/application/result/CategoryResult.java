package com.new_cafe.app.backend.category.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryResult {
    private final Long id;
    private final String name;
    private final String icon;
    private final int sortOrder;
}
