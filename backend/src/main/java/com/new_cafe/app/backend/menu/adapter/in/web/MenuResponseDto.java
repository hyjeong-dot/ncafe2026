package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 메뉴 응답 DTO (Input Adapter 전용)
 * - 컨트롤러(웹 계층)에서만 사용합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponseDto {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private String categoryName;
    private String categoryIcon;
    private String imageSrc;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
