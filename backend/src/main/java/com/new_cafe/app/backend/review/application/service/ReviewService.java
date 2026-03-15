package com.new_cafe.app.backend.review.application.service;

import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.review.adapter.in.web.dto.ReviewRequest;
import com.new_cafe.app.backend.review.adapter.in.web.dto.ReviewResponse;
import com.new_cafe.app.backend.review.domain.model.Review;
import com.new_cafe.app.backend.review.domain.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final LoadMemberPort loadMemberPort;

    private static final int MAX_STICKERS = 5;

    /**
     * 리뷰 작성 + 스티커 지급
     */
    @Transactional
    public ReviewResponse createReview(String username, ReviewRequest request) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 이미 리뷰를 작성한 주문인지 확인
        if (reviewRepository.existsByOrderId(request.getOrderId())) {
            throw new IllegalStateException("이미 리뷰를 작성한 주문입니다.");
        }

        // 스티커 번호 결정 (1~5번째 리뷰까지만 스티커 지급)
        long reviewCount = reviewRepository.countByMemberId(member.getId());
        Integer stickerNumber = null;
        boolean stickerEnded = false;

        if (reviewCount < MAX_STICKERS) {
            stickerNumber = (int) (reviewCount + 1); // 1, 2, 3, 4, 5
        } else {
            stickerEnded = true;
        }

        Review review = Review.builder()
                .memberId(member.getId())
                .orderId(request.getOrderId())
                .content(request.getContent())
                .rating(request.getRating())
                .stickerNumber(stickerNumber)
                .build();

        Review saved = reviewRepository.save(review);
        log.info("Review created: orderId={}, sticker={}", request.getOrderId(), stickerNumber);

        return ReviewResponse.from(saved, member.getNickname(), stickerEnded);
    }

    /**
     * 내 리뷰 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        long reviewCount = reviewRepository.countByMemberId(member.getId());
        boolean stickerEnded = reviewCount >= MAX_STICKERS;

        return reviewRepository.findByMemberIdOrderByCreatedAtDesc(member.getId()).stream()
                .map(r -> ReviewResponse.from(r, member.getNickname(), stickerEnded))
                .collect(Collectors.toList());
    }

    /**
     * 특정 주문에 대한 리뷰 조회
     */
    @Transactional(readOnly = true)
    public ReviewResponse getReviewByOrderId(Long orderId, String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Review review = reviewRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        long reviewCount = reviewRepository.countByMemberId(member.getId());
        return ReviewResponse.from(review, member.getNickname(), reviewCount >= MAX_STICKERS);
    }

    /**
     * 내가 받은 스티커 목록
     */
    @Transactional(readOnly = true)
    public StickerStatusResponse getStickerStatus(String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        long reviewCount = reviewRepository.countByMemberId(member.getId());
        int collected = (int) Math.min(reviewCount, MAX_STICKERS);

        return StickerStatusResponse.builder()
                .collectedCount(collected)
                .maxStickers(MAX_STICKERS)
                .stickerEnded(reviewCount >= MAX_STICKERS)
                .build();
    }
}
