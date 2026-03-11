package com.new_cafe.app.backend.admin.cafe.application.port.in;

import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalTime;

public interface UpdateCafeSettingsUseCase {
    CafeSettingsResult updateSettings(UpdateSettingsCommand command);

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    class UpdateSettingsCommand {
        private String cafeName;
        private String description;
        private String phoneNumber;
        private String address;
        private LocalTime openTime;
        private LocalTime closeTime;
        private boolean isManualClosed;
        private String instagramUrl;
    }
}
