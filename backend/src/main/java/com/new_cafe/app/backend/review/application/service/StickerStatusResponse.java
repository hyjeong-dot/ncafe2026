package com.new_cafe.app.backend.review.application.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StickerStatusResponse {
    private int collectedCount;  // 수집한 스티커 수
    private int maxStickers;     // 최대 스티커 수 (5)
    private boolean stickerEnded; // 선착순 종료 여부
}
