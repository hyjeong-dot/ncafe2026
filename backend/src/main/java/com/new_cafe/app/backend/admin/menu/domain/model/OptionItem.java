package com.new_cafe.app.backend.admin.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 옵션 항목 엔티티
 * - 하나의 옵션 그룹에 여러 항목이 들어감 (1:N)
 * - 예: "사이즈 선택" → Regular(+0), Large(+500)
 */
@Entity(name = "AdminOptionItem")
@Table(name = "option_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "price_delta")
    private Integer priceDelta;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @PrePersist
    protected void onCreate() {
        if (this.priceDelta == null) this.priceDelta = 0;
        if (this.sortOrder == null) this.sortOrder = 0;
    }
}
