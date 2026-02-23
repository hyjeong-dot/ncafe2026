package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import com.new_cafe.app.backend.admin.menu.application.command.AddMenuImageCommand;
import lombok.Data;

@Data
public class AddMenuImageRequest {
    private String srcUrl;
    private Integer sortOrder;

    public AddMenuImageCommand toCommand(Long menuId) {
        return AddMenuImageCommand.builder()
                .menuId(menuId)
                .srcUrl(srcUrl)
                .sortOrder(sortOrder)
                .build();
    }
}
