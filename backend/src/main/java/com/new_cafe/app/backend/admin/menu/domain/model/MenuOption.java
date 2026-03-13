package com.new_cafe.app.backend.admin.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 메뉴 옵션 그룹 엔티티
 * - 하나의 메뉴에 여러 옵션 그룹이 붙을 수 있음 (1:N)
 * - 예: "사이즈 선택", "온도", "샷 추가", "빵 선택" 등
 */
@Entity(name = "AdminMenuOption")
@Table(name = "menu_options")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "is_required")
    private Boolean isRequired;

    @Column(name = "is_multi_select")
    private Boolean isMultiSelect;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @PrePersist
    protected void onCreate() {
        if (this.isRequired == null) this.isRequired = false;
        if (this.isMultiSelect == null) this.isMultiSelect = false;
        if (this.sortOrder == null) this.sortOrder = 0;
    }
}
