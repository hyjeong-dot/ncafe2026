package com.new_cafe.app.backend.payment.adapter.in.web;

import com.new_cafe.app.backend.payment.adapter.in.web.request.ConfirmPaymentRequest;
import com.new_cafe.app.backend.payment.application.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /** 토스페이먼츠 결제 승인 */
    @PostMapping("/confirm")
    public Map<String, Object> confirmPayment(@RequestBody ConfirmPaymentRequest request) {
        return paymentService.confirmPayment(request);
    }
}
