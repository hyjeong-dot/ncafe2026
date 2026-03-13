package com.new_cafe.app.backend.admin.menu.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OptionItemResult {
    private final Long id;
    private final Long optionId;
    private final String name;
    private final Integer priceDelta;
    private final Integer sortOrder;
}
