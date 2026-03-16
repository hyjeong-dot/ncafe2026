package com.new_cafe.app.backend.inquiry.adapter.in.web.dto;

import com.new_cafe.app.backend.inquiry.domain.model.Inquiry;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InquiryResponse {
    private Long id;
    private String nickname;
    private String title;
    private String content;
    private String category;
    private String categoryLabel;
    private String status;
    private String statusLabel;
    private String answer;
    private LocalDateTime answeredAt;
    private LocalDateTime createdAt;

    public static InquiryResponse from(Inquiry inquiry, String nickname) {
        return InquiryResponse.builder()
                .id(inquiry.getId())
                .nickname(nickname)
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .category(inquiry.getCategory())
                .categoryLabel(getCategoryLabel(inquiry.getCategory()))
                .status(inquiry.getStatus().name())
                .statusLabel(getStatusLabel(inquiry.getStatus().name()))
                .answer(inquiry.getAnswer())
                .answeredAt(inquiry.getAnsweredAt())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }

    private static String getCategoryLabel(String category) {
        switch (category) {
            case "MENU": return "메뉴 문의";
            case "ORDER": return "주문·결제";
            case "STORE": return "매장 이용";
            case "OTHER": return "기타";
            default: return category;
        }
    }

    private static String getStatusLabel(String status) {
        switch (status) {
            case "WAITING": return "대기중";
            case "ANSWERED": return "답변완료";
            case "CLOSED": return "종료";
            default: return status;
        }
    }
}
