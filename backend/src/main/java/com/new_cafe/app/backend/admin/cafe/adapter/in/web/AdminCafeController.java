package com.new_cafe.app.backend.admin.cafe.adapter.in.web;

import com.new_cafe.app.backend.admin.cafe.application.port.in.GetCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.port.in.UpdateCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
@Slf4j
public class AdminCafeController {

    private final GetCafeSettingsUseCase getCafeSettingsUseCase;
    private final UpdateCafeSettingsUseCase updateCafeSettingsUseCase;

    @GetMapping
    public CafeSettingsResult getSettings() {
        return getCafeSettingsUseCase.getSettings();
    }

    @PutMapping
    public CafeSettingsResult updateSettings(@RequestBody UpdateCafeSettingsUseCase.UpdateSettingsCommand command) {
        log.info("Updating cafe settings: {}", command.getCafeName());
        return updateCafeSettingsUseCase.updateSettings(command);
    }
}
