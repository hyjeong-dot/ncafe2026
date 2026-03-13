package com.new_cafe.app.backend.payment.adapter.in.web.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfirmPaymentRequest {
    private String paymentKey;
    private String orderId;   // orderUid
    private int amount;
}
