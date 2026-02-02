package com.new_cafe.app.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDetailResponse {
    private String id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String categoryName;
    private Integer categoryId;
    private String imageSrc;
    private List<String> images;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private int sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
