package com.new_cafe.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageResponse {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private String altText;
    private int sortOrder;
    // private LocalDateTime createdAt;
    // private LocalDateTime updatedAt;
    // 필요하면 주석 풀기
}
