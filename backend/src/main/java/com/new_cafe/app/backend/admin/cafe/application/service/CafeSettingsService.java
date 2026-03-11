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
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeSettingsService implements GetCafeSettingsUseCase, UpdateCafeSettingsUseCase {

    private final CafeSettingsJpaRepository repository;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Override
    @Transactional(readOnly = true)
    public CafeSettingsResult getSettings() {
        CafeSettings settings = getOrCreateSettings();
        return toResult(settings);
    }

    @Override
    public CafeSettingsResult updateSettings(UpdateSettingsCommand command) {
        CafeSettings settings = getOrCreateSettings();

        if (command.getCafeName() != null) settings.setCafeName(command.getCafeName());
        if (command.getDescription() != null) settings.setDescription(command.getDescription());
        if (command.getPhoneNumber() != null) settings.setPhoneNumber(command.getPhoneNumber());
        if (command.getAddress() != null) settings.setAddress(command.getAddress());
        if (command.getOpenTime() != null) settings.setOpenTime(LocalTime.parse(command.getOpenTime(), TIME_FMT));
        if (command.getCloseTime() != null) settings.setCloseTime(LocalTime.parse(command.getCloseTime(), TIME_FMT));
        if (command.getInstagramUrl() != null) settings.setInstagramUrl(command.getInstagramUrl());
        settings.setManualClosed(command.isManualClosed());

        return toResult(repository.save(settings));
    }

    private CafeSettings getOrCreateSettings() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> repository.save(CafeSettings.builder()
                        .cafeName("Meta Cafe")
                        .description("메타몽이 운영하는 힐링 카페에 오신 걸 환영해몽! (._.)")
                        .openTime(LocalTime.of(9, 0))
                        .closeTime(LocalTime.of(22, 0))
                        .manualClosed(false)
                        .build()));
    }

    private CafeSettingsResult toResult(CafeSettings settings) {
        return CafeSettingsResult.builder()
                .cafeName(settings.getCafeName())
                .description(settings.getDescription())
                .phoneNumber(settings.getPhoneNumber())
                .address(settings.getAddress())
                .openTime(settings.getOpenTime() != null ? settings.getOpenTime().format(TIME_FMT) : "09:00:00")
                .closeTime(settings.getCloseTime() != null ? settings.getCloseTime().format(TIME_FMT) : "22:00:00")
                .manualClosed(settings.isManualClosed())
                .instagramUrl(settings.getInstagramUrl())
                .open(settings.isOpen())
                .build();
    }
}
