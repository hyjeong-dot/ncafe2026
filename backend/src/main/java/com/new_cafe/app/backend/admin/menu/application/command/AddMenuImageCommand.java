package com.new_cafe.app.backend.admin.menu.application.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AddMenuImageCommand {
    private final Long menuId;
    private final String srcUrl;
    private final Integer sortOrder;
}
