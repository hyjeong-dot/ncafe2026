package com.new_cafe.app.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String image;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private java.sql.Timestamp createdAt;
    private java.sql.Timestamp updatedAt;

    private Category category;
}
