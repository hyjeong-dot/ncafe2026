package com.new_cafe.app.backend.admin.cafe.application.port.in;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public interface UpdateCafeSettingsUseCase {
    CafeSettingsResult updateSettings(UpdateSettingsCommand command);

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    class UpdateSettingsCommand {
        private String cafeName;
        private String description;
        private String phoneNumber;
        private String address;
        private String openTime;   // "09:00:00" 형태의 String
        private String closeTime;  // "22:00:00" 형태의 String
        private boolean manualClosed;
        private String instagramUrl;
    }
}
