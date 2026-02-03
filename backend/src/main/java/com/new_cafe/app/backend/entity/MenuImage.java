package com.new_cafe.app.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImage {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private Integer sortOrder;
    private Timestamp createdAt;
}
