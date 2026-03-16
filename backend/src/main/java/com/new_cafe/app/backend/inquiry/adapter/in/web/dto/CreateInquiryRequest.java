package com.new_cafe.app.backend.inquiry.adapter.in.web.dto;

import lombok.Data;

@Data
public class CreateInquiryRequest {
    private String title;
    private String content;
    private String category; // MENU, ORDER, PAYMENT, STORE, OTHER
}
