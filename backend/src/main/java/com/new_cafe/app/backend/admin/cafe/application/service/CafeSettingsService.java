package com.new_cafe.app.backend.admin.cafe.application.service;

import com.new_cafe.app.backend.admin.cafe.application.port.in.GetCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.port.in.UpdateCafeSettingsUseCase;
import com.new_cafe.app.backend.admin.cafe.application.result.CafeSettingsResult;
import com.new_cafe.app.backend.admin.cafe.domain.model.CafeSettings;
import com.new_cafe.app.backend.admin.cafe.adapter.out.persistence.CafeSettingsJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeSettingsService implements GetCafeSettingsUseCase, UpdateCafeSettingsUseCase {

    private final CafeSettingsJpaRepository repository;

    @Override
    @Transactional(readOnly = true)
    public CafeSettingsResult getSettings() {
        CafeSettings settings = getOrCreateSettings();
        return toResult(settings);
    }

    @Override
    public CafeSettingsResult updateSettings(UpdateSettingsCommand command) {
        CafeSettings settings = getOrCreateSettings();
        
        settings.setCafeName(command.getCafeName());
        settings.setDescription(command.getDescription());
        settings.setPhoneNumber(command.getPhoneNumber());
        settings.setAddress(command.getAddress());
        settings.setOpenTime(command.getOpenTime());
        settings.setCloseTime(command.getCloseTime());
        settings.setManualClosed(command.isManualClosed());
        settings.setInstagramUrl(command.getInstagramUrl());
        
        return toResult(repository.save(settings));
    }

    private CafeSettings getOrCreateSettings() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> repository.save(CafeSettings.builder()
                        .cafeName("Meta Cafe")
                        .description("메타몽이 운영하는 힐링 카페에 오신 걸 환영해몽! (._.)")
                        .openTime(LocalTime.of(9, 0))
                        .closeTime(LocalTime.of(22, 0))
                        .isManualClosed(false)
                        .build()));
    }

    private CafeSettingsResult toResult(CafeSettings settings) {
        return CafeSettingsResult.builder()
                .cafeName(settings.getCafeName())
                .description(settings.getDescription())
                .phoneNumber(settings.getPhoneNumber())
                .address(settings.getAddress())
                .openTime(settings.getOpenTime())
                .closeTime(settings.getCloseTime())
                .isManualClosed(settings.isManualClosed())
                .instagramUrl(settings.getInstagramUrl())
                .isOpen(settings.isOpen())
                .build();
    }
}
