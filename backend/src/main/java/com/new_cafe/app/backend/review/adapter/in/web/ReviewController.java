package com.new_cafe.app.backend.review.adapter.in.web;

import com.new_cafe.app.backend.review.adapter.in.web.dto.ReviewRequest;
import com.new_cafe.app.backend.review.adapter.in.web.dto.ReviewResponse;
import com.new_cafe.app.backend.review.application.service.ReviewService;
import com.new_cafe.app.backend.review.application.service.StickerStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 리뷰 작성
     */
    @PostMapping
    public ReviewResponse createReview(Authentication auth, @RequestBody ReviewRequest request) {
        return reviewService.createReview(auth.getName(), request);
    }

    /**
     * 내 리뷰 목록
     */
    @GetMapping
    public List<ReviewResponse> getMyReviews(Authentication auth) {
        return reviewService.getMyReviews(auth.getName());
    }

    /**
     * 특정 주문의 리뷰 조회
     */
    @GetMapping("/order/{orderId}")
    public ReviewResponse getReviewByOrder(@PathVariable Long orderId, Authentication auth) {
        return reviewService.getReviewByOrderId(orderId, auth.getName());
    }

    /**
     * 스티커 현황
     */
    @GetMapping("/stickers")
    public StickerStatusResponse getStickerStatus(Authentication auth) {
        return reviewService.getStickerStatus(auth.getName());
    }
}
