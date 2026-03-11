package com.new_cafe.app.backend.admin.cafe.adapter.in.web;

import com.new_cafe.app.backend.admin.cafe.application.port.in.GetCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.port.in.UpdateCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/store-info")
@RequiredArgsConstructor
public class AdminCafeController {

    private final GetCafeSettingsUseCase getCafeSettingsUseCase;
    private final UpdateCafeSettingsUseCase updateCafeSettingsUseCase;

    @GetMapping
    public CafeSettingsResult getSettings() {
        return getCafeSettingsUseCase.getSettings();
    }

    @PutMapping
    public CafeSettingsResult updateSettings(@RequestBody UpdateCafeSettingsUseCase.UpdateSettingsCommand command) {
        return updateCafeSettingsUseCase.updateSettings(command);
    }
}
