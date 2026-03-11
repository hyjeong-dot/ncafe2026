package com.new_cafe.app.backend.admin.cafe.application.result;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CafeSettingsResult {
    private final String cafeName;
    private final String description;
    private final String phoneNumber;
    private final String address;
    private final String openTime;   // "09:00" 형태의 String
    private final String closeTime;  // "22:00" 형태의 String
    private final boolean manualClosed;
    private final String instagramUrl;
    private final boolean open;
}
