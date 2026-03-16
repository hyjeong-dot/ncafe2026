package com.new_cafe.app.backend.review.domain.model;

import com.new_cafe.app.backend.order.domain.model.Order;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    private Order order;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private int rating; // 1~5

    /** 리뷰 작성 시 받은 스티커 번호 (1~5), null이면 스티커 없음 */
    @Column(name = "sticker_number")
    private Integer stickerNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /** 하위 호환용 */
    public Long getOrderId() {
        return order != null ? order.getId() : null;
    }
}

