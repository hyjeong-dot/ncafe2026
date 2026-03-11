package com.new_cafe.app.backend.admin.cafe.application.result;

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
    private final LocalTime openTime;
    private final LocalTime closeTime;
    private final boolean isManualClosed;
    private final String instagramUrl;
    private final boolean isOpen; // 현재 영업 여부 (계산된 값)
}
