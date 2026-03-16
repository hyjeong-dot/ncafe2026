package com.new_cafe.app.backend.payment.application.service;

import com.new_cafe.app.backend.payment.adapter.in.web.request.ConfirmPaymentRequest;
import com.new_cafe.app.backend.order.adapter.out.persistence.repository.OrderRepository;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderStatus;
import com.new_cafe.app.backend.admin.cafe.application.port.in.GetCafeSettingsUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final OrderRepository orderRepository;
    private final GetCafeSettingsUseCase getCafeSettingsUseCase;

    @Value("${toss.secret-key:}")
    private String secretKey;

    private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    /** 토스페이먼츠 결제 승인 요청 후 주문 상태를 PAID로 변경 */
    @Transactional
    public Map<String, Object> confirmPayment(ConfirmPaymentRequest req) {
        if (!getCafeSettingsUseCase.getSettings().isOpen()) {
            throw new IllegalStateException("현재 진행 중인 영업 시간이 아닙니다. 결제를 진행할 수 없습니다.");
        }

        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("TOSS_SECRET_KEY 환경 변수가 설정되지 않았습니다.");
        }

        String paymentKey = req.getPaymentKey();
        String orderUid = req.getOrderId();
        int amount = req.getAmount();
        // 1. 주문 조회 및 금액 검증
        Order order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderUid));

        if (order.getTotalPrice() != amount) {
            throw new IllegalArgumentException(
                    "결제 금액이 주문 금액과 일치하지 않습니다. 예상: " + order.getTotalPrice() + ", 실제: " + amount);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("결제 대기 상태가 아닌 주문입니다. 현재 상태: " + order.getStatus());
        }

        try {
            // 2. 토스페이먼츠 승인 API 호출
            String authHeader = "Basic "
                    + Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

            String requestBody = String.format(
                    "{\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%d}",
                    paymentKey, orderUid, amount);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(TOSS_CONFIRM_URL))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // 3. 결제 성공 → 주문 상태 업데이트
                order.setPaymentKey(paymentKey);
                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);

                log.info("결제 승인 성공: orderUid={}, paymentKey={}", orderUid, paymentKey);
                return Map.of(
                        "success", true,
                        "orderId", orderUid,
                        "paymentKey", paymentKey,
                        "status", "PAID");
            } else {
                log.error("토스 결제 승인 실패: {}", response.body());
                throw new RuntimeException("결제 승인에 실패했습니다: " + response.body());
            }
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("결제 승인 중 오류 발생", e);
            throw new RuntimeException("결제 처리 중 오류가 발생했습니다.", e);
        }
    }
}
