package com.new_cafe.app.backend.admin.cafe.application.port.in;

import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;

public interface GetCafeSettingsUseCase {
    CafeSettingsResult getSettings();
}
