package com.new_cafe.app.backend.admin.cafe.application.port.in;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

public interface UpdateCafeSettingsUseCase {
    CafeSettingsResult updateSettings(UpdateSettingsCommand command);

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    class UpdateSettingsCommand {
        private String cafeName;
        private String description;
        private String phoneNumber;
        private String address;
        private LocalTime openTime;
        private LocalTime closeTime;
        private boolean manualClosed;
        private String instagramUrl;
    }
}
