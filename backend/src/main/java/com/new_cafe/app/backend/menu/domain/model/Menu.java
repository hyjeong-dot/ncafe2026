package com.new_cafe.app.backend.menu.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 메뉴 도메인 모델 (순수 자바 객체)
 * - 외부 기술(Spring, JPA, DB)에 의존하지 않습니다.
 * - 비즈니스 규칙과 검증 로직은 이 클래스에 작성합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "menus")
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- 비즈니스 로직 ---

    /**
     * 메뉴가 주문 가능한 상태인지 확인
     */
    public boolean canOrder() {
        return Boolean.TRUE.equals(isAvailable) && !Boolean.TRUE.equals(isSoldOut);
    }

    /**
     * 품절 처리
     */
    public void markSoldOut() {
        this.isSoldOut = true;
    }

    /**
     * 품절 해제
     */
    public void clearSoldOut() {
        this.isSoldOut = false;
    }

    /**
     * 가격 변경 (0 이상만 허용)
     */
    public void changePrice(int newPrice) {
        if (newPrice < 0) {
            throw new IllegalArgumentException("가격은 0 이상이어야 합니다.");
        }
        this.price = newPrice;
    }
}
