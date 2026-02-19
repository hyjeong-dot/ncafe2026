package com.new_cafe.app.backend.category.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 독립된 카테고리 도메인 모델
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private Long id;
    private String name;
    private String icon;
    private int sortOrder;
}
