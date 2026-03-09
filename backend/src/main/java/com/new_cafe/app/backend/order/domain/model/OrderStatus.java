package com.new_cafe.app.backend.order.domain.model;

public enum OrderStatus {
    PENDING,     // 결제 대기
    PAID,        // 결제 완료
    PREPARING,   // 제조 중
    COMPLETED,   // 제공 완료
    CANCELLED    // 취소됨
}
