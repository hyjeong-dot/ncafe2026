package com.new_cafe.app.backend.admin.cafe.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "cafe_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CafeSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cafe_name", nullable = false)
    private String cafeName;

    private String description; // 사장님 한마디/공지

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "is_manual_closed")
    private boolean isManualClosed; // 강제 마감 여부

    @Column(name = "instagram_url")
    private String instagramUrl;

    // 비즈니스 로직: 현재 영업 중인지 확인
    public boolean isOpen() {
        if (isManualClosed) return false;
        
        LocalTime now = LocalTime.now();
        if (openTime == null || closeTime == null) return true; // 설정 없으면 일단 오픈
        
        return !now.isBefore(openTime) && !now.isAfter(closeTime);
    }
}
