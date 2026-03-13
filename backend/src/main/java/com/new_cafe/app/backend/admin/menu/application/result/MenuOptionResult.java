package com.new_cafe.app.backend.admin.menu.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class MenuOptionResult {
    private final Long id;
    private final Long menuId;
    private final String name;
    private final Boolean isRequired;
    private final Boolean isMultiSelect;
    private final Integer sortOrder;
    private final List<OptionItemResult> items;
}
