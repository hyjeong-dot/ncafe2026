package com.new_cafe.app.backend.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 일반 사용자 전용 메뉴 도메인 모델 및 엔티티
 * - 고객에게 노출되는 정보 위주로 구성됩니다.
 * - 조회 성능 최적화 및 고객용 비즈니스 로직(할인 등)을 가질 수 있습니다.
 */
@Entity
@Table(name = "menus")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

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

    // 고객은 생성/수정일이 필요 없을 수도 있지만, 정렬 등을 위해 남겨둡니다.
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
