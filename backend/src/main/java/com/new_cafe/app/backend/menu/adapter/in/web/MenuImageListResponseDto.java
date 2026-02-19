package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 메뉴 이미지 목록 응답 DTO (Input Adapter 전용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageListResponseDto {
    private List<MenuImageResponseDto> images;
}
