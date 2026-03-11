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
    public Object getSettings() {
        try {
            return getCafeSettingsUseCase.getSettings();
        } catch (Exception e) {
            System.err.println("=== GET SETTINGS ERROR ===");
            e.printStackTrace();
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            e.printStackTrace(pw);
            return java.util.Map.of(
                "error", e.getMessage() != null ? e.getMessage() : "null",
                "type", e.getClass().getName(),
                "stackTrace", sw.toString()
            );
        }
    }

    @PutMapping
    public Object updateSettings(@RequestBody UpdateCafeSettingsUseCase.UpdateSettingsCommand command) {
        try {
            log.info("Updating cafe settings: {}", command.getCafeName());
            return updateCafeSettingsUseCase.updateSettings(command);
        } catch (Exception e) {
            System.err.println("=== UPDATE SETTINGS ERROR ===");
            e.printStackTrace();
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            e.printStackTrace(pw);
            return java.util.Map.of(
                "error", e.getMessage() != null ? e.getMessage() : "null",
                "type", e.getClass().getName(),
                "stackTrace", sw.toString()
            );
        }
    }
}
