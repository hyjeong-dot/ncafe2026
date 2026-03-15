package com.new_cafe.app.backend.coupon.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 스탬프 카드 (10잔 적립)
 */
@Entity
@Table(name = "stamp_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StampCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    @Builder.Default
    @Column(nullable = false)
    private int stamps = 0; // 현재 적립 수 (0~10)

    @Builder.Default
    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 스탬프 추가 (주문 시 호출)
     * @return 10개 달성 시 true
     */
    public boolean addStamp() {
        if (completed) return false;
        this.stamps++;
        if (this.stamps >= 10) {
            this.completed = true;
            return true; // 10잔 달성!
        }
        return false;
    }
}
