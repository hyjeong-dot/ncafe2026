package com.new_cafe.app.backend.admin.cafe.application.result;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalTime;

@Getter
@Builder
public class CafeSettingsResult {
    private final String cafeName;
    private final String description;
    private final String phoneNumber;
    private final String address;
    @JsonFormat(pattern = "HH:mm:ss")
    private final LocalTime openTime;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private final LocalTime closeTime;
    
    @JsonProperty("isManualClosed")
    private final boolean isManualClosed;
    private final String instagramUrl;
    private final boolean isOpen; // 현재 영업 여부 (계산된 값)
}
