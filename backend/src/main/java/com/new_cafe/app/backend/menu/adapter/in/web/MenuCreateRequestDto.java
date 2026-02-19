package com.new_cafe.app.backend.menu.adapter.in.web;

import lombok.Data;

@Data
public class MenuCreateRequestDto {
    private String korName;
    private String engName;
    private String description;
    private int price;
    private Long categoryId;
    private String imageSrc;
    private Boolean isAvailable;
    private int sortOrder;
}
