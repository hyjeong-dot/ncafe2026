package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.Data;

@Data
public class MenuUpdateRequestDto {
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private Long categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
}
