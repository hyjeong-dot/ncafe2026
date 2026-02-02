package com.new_cafe.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuCreateRequest {
    private String korName;
    private String engName;
    private String description;
    private int price;
    private Integer categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private int sortOrder;
}
