package com.new_cafe.app.backend.admin.cafe.application.port.in;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    class UpdateSettingsCommand {
        private String cafeName;
        private String description;
        private String phoneNumber;
        private String address;
        
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime openTime;
        
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime closeTime;
        
        @JsonProperty("isManualClosed")
        private boolean isManualClosed;
        
        private String instagramUrl;
    }
}
