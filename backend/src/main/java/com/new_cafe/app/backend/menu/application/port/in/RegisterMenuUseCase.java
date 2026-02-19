package com.new_cafe.app.backend.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;

public interface RegisterMenuUseCase {
    Long registerMenu(RegisterMenuCommand command);

    @Getter
    @Builder
    class RegisterMenuCommand {
        private final String korName;
        private final String engName;
        private final String description;
        private final int price;
        private final Long categoryId;
        private final String imageSrc;
        private final Boolean isAvailable;
        private final int sortOrder;
    }
}
