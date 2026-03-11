package com.new_cafe.app.backend.admin.cafe.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "cafe_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CafeSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cafe_name", nullable = false)
    private String cafeName;

    private String description;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "is_manual_closed")
    private boolean manualClosed; // "is" 접두사 제거 → Lombok이 isManualClosed() 생성

    @Column(name = "instagram_url")
    private String instagramUrl;

    // 비즈니스 로직: 현재 영업 중인지 확인
    public boolean isOpen() {
        if (manualClosed) return false;

        LocalTime now = LocalTime.now();
        if (openTime == null || closeTime == null) return true;

        return !now.isBefore(openTime) && !now.isAfter(closeTime);
    }
}
