package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메뉴 이미지 응답 DTO (Input Adapter 전용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageResponseDto {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private String altText;
    private int sortOrder;
}
