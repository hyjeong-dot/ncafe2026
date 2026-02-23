package com.new_cafe.app.backend.admin.menu.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MenuImageResult {
    private final Long id;
    private final Long menuId;
    private final String srcUrl;
    private final Integer sortOrder;
}
