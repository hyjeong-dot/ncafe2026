package com.new_cafe.app.backend.favorite.application.command;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class ToggleFavoriteCommand {
    private final UUID memberId;
    private final Long menuId;
}
