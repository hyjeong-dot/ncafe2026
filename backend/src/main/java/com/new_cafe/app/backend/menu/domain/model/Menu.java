package com.new_cafe.app.backend.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 사용자용 메뉴 도메인 모델 및 JPA 엔티티
 * - 고객에게 노출되는 정보 위주로 구성됩니다.
 * - 조회 전용 (CUD는 admin/menu에서 처리)
 */
@Entity(name = "UserMenu")
@Table(name = "menus")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    @Column(unique = true)
    private String slug;

    private String description;

    private int price;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "is_sold_out")
    private Boolean isSoldOut;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- 사용자용 비즈니스 로직 ---
    public boolean canOrder() {
        return Boolean.TRUE.equals(isAvailable) && !Boolean.TRUE.equals(isSoldOut);
    }
}
