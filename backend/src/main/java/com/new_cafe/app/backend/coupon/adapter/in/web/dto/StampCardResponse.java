package com.new_cafe.app.backend.coupon.adapter.in.web.dto;

import com.new_cafe.app.backend.coupon.domain.model.StampCard;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StampCardResponse {
    private Long id;
    private int stamps;
    private boolean completed;
    private LocalDateTime createdAt;

    public static StampCardResponse from(StampCard card) {
        return StampCardResponse.builder()
                .id(card.getId())
                .stamps(card.getStamps())
                .completed(card.isCompleted())
                .createdAt(card.getCreatedAt())
                .build();
    }
}
