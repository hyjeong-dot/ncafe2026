package com.new_cafe.app.backend.menu.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MenuImageResult {
    private final Long id;
    private final Long menuId;
    private final String srcUrl;
    private final String altText;
    private final int sortOrder;
}
