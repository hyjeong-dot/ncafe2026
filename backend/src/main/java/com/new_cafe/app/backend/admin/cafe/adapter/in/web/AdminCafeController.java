package com.new_cafe.app.backend.admin.cafe.adapter.in.web;

import com.new_cafe.app.backend.admin.cafe.application.port.in.GetCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.port.in.UpdateCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/store-info")
@RequiredArgsConstructor
public class AdminCafeController {

    private final GetCafeSettingsUseCase getCafeSettingsUseCase;
    private final UpdateCafeSettingsUseCase updateCafeSettingsUseCase;

    @GetMapping
    public Map<String, Object> getSettings() {
        try {
            CafeSettingsResult result = getCafeSettingsUseCase.getSettings();
            // 수동으로 Map 변환 (Jackson 직렬화 문제 완전 회피)
            return Map.of(
                "cafeName", result.getCafeName() != null ? result.getCafeName() : "",
                "description", result.getDescription() != null ? result.getDescription() : "",
                "phoneNumber", result.getPhoneNumber() != null ? result.getPhoneNumber() : "",
                "address", result.getAddress() != null ? result.getAddress() : "",
                "openTime", result.getOpenTime() != null ? result.getOpenTime() : "09:00:00",
                "closeTime", result.getCloseTime() != null ? result.getCloseTime() : "22:00:00",
                "manualClosed", result.isManualClosed(),
                "instagramUrl", result.getInstagramUrl() != null ? result.getInstagramUrl() : "",
                "open", result.isOpen()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage() != null ? e.getMessage() : "unknown", "type", e.getClass().getName());
        }
    }

    @PutMapping
    public Map<String, Object> updateSettings(@RequestBody Map<String, Object> body) {
        try {
            // Map에서 직접 Command 생성 (Jackson 역직렬화 문제 완전 회피)
            UpdateCafeSettingsUseCase.UpdateSettingsCommand command = new UpdateCafeSettingsUseCase.UpdateSettingsCommand();
            command.setCafeName((String) body.getOrDefault("cafeName", null));
            command.setDescription((String) body.getOrDefault("description", null));
            command.setPhoneNumber((String) body.getOrDefault("phoneNumber", null));
            command.setAddress((String) body.getOrDefault("address", null));
            command.setOpenTime((String) body.getOrDefault("openTime", null));
            command.setCloseTime((String) body.getOrDefault("closeTime", null));
            command.setManualClosed(Boolean.TRUE.equals(body.getOrDefault("manualClosed", false)));
            command.setInstagramUrl((String) body.getOrDefault("instagramUrl", null));

            CafeSettingsResult result = updateCafeSettingsUseCase.updateSettings(command);

            return Map.of(
                "cafeName", result.getCafeName() != null ? result.getCafeName() : "",
                "description", result.getDescription() != null ? result.getDescription() : "",
                "phoneNumber", result.getPhoneNumber() != null ? result.getPhoneNumber() : "",
                "address", result.getAddress() != null ? result.getAddress() : "",
                "openTime", result.getOpenTime() != null ? result.getOpenTime() : "09:00:00",
                "closeTime", result.getCloseTime() != null ? result.getCloseTime() : "22:00:00",
                "manualClosed", result.isManualClosed(),
                "instagramUrl", result.getInstagramUrl() != null ? result.getInstagramUrl() : "",
                "open", result.isOpen()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage() != null ? e.getMessage() : "unknown", "type", e.getClass().getName());
        }
    }
}
