package com.new_cafe.app.backend.review.adapter.in.web.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewRequest {
    private Long orderId;
    private String content;
    private int rating; // 1~5
}
