package com.new_cafe.app.backend.admin.category.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CategoryListResult {
    private final List<CategoryResult> categories;
    private final int count;
}
