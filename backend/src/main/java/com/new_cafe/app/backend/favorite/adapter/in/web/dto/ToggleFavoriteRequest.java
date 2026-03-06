package com.new_cafe.app.backend.favorite.adapter.in.web.dto;

import com.new_cafe.app.backend.favorite.application.command.ToggleFavoriteCommand;
import lombok.Data;
import java.util.UUID;

@Data
public class ToggleFavoriteRequest {
    private Long menuId;

    public ToggleFavoriteCommand toCommand(UUID memberId) {
        return ToggleFavoriteCommand.builder()
                .memberId(memberId)
                .menuId(menuId)
                .build();
    }
}
