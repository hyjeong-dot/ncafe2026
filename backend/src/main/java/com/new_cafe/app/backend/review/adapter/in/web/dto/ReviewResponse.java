package com.new_cafe.app.backend.review.adapter.in.web.dto;

import com.new_cafe.app.backend.review.domain.model.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long orderId;
    private String content;
    private int rating;
    private Integer stickerNumber; // 1~5 or null
    private String nickname;
    private boolean stickerEnded; // 선착순 종료 여부
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review review, String nickname, boolean stickerEnded) {
        return ReviewResponse.builder()
                .id(review.getId())
                .orderId(review.getOrderId())
                .content(review.getContent())
                .rating(review.getRating())
                .stickerNumber(review.getStickerNumber())
                .nickname(nickname)
                .stickerEnded(stickerEnded)
                .createdAt(review.getCreatedAt())
                .build();
    }
}
