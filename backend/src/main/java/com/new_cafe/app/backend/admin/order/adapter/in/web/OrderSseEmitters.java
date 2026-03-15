package com.new_cafe.app.backend.admin.order.adapter.in.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 관리자 주문 SSE 이벤트 브로커
 * - 관리자가 SSE 구독하면 emitter 등록
 * - 주문 생성/변경 시 모든 구독자에게 이벤트 전송
 */
@Component
@Slf4j
public class OrderSseEmitters {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter add() {
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L); // 1시간 타임아웃
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        // 연결 즉시 초기 이벤트 전송 (연결 확인용)
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("SSE connected"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        log.info("[OrderSSE] 새 구독자 연결. 현재 구독자 수: {}", emitters.size());
        return emitter;
    }

    /**
     * 모든 구독자에게 주문 변경 이벤트 전송
     */
    public void notify(String eventType) {
        log.info("[OrderSSE] '{}' 이벤트 전송. 구독자 수: {}", eventType, emitters.size());
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("order-update")
                        .data(eventType));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
