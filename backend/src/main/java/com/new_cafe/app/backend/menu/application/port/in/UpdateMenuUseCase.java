package com.new_cafe.app.backend.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;

public interface UpdateMenuUseCase {
    void updateMenu(UpdateMenuCommand command);

    @Getter
    @Builder
    class UpdateMenuCommand {
        private final Long id;
        private final String korName;
        private final String engName;
        private final String description;
        private final Integer price;
        private final Long categoryId;
        private final String imageSrc;
        private final Boolean isAvailable;
        private final Boolean isSoldOut;
        private final Integer sortOrder;
    }
}
