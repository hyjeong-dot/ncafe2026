package com.new_cafe.app.backend.admin.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateAdminMenuCommand {
    private final Long id;
    private final String korName;
    private final String engName;
    private final String description;
    private final int price;
    private final Long categoryId;
    private final String imageSrc;
    private final Boolean isAvailable;
    private final Boolean isSoldOut;
    private final Integer sortOrder;
}
