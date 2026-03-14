package com.new_cafe.app.backend.admin.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 관리자 전용 메뉴 도메인 모델 및 엔티티
 * - 관리자 활동(등록, 수정, 삭제)에 필요한 모든 필드와 로직을 포함합니다.
 */
@Entity(name = "AdminMenu")
@Table(name = "menus")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name", nullable = false)
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    @Column(unique = true)
    private String slug;

    private String description;

    @Column(nullable = false)
    private int price;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "is_sold_out")
    private Boolean isSoldOut;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isAvailable == null) this.isAvailable = true;
        if (this.isSoldOut == null) this.isSoldOut = false;
        if (this.sortOrder == null) this.sortOrder = 0;
        if (this.slug == null && this.engName != null) {
            this.slug = generateSlug(this.engName);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- 관리용 비즈니스 로직 ---
    
    public void updatePrice(int newPrice) {
        if (newPrice < 0) throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        this.price = newPrice;
    }

    /**
     * engName → slug 변환 유틸
     * 예: "Purple Latte" → "purple-latte"
     */
    public static String generateSlug(String engName) {
        if (engName == null || engName.isBlank()) return null;
        return engName
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
