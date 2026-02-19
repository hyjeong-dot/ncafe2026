package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 상세 응답 DTO (Input Adapter 전용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDetailResponseDto {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String categoryName;
    private Boolean isAvailable;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
