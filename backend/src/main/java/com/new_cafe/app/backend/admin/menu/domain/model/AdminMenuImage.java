package com.new_cafe.app.backend.admin.menu.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity(name = "AdminMenuImage")
@Table(name = "menu_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMenuImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(name = "src_url", nullable = false)
    private String srcUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.sortOrder == null) this.sortOrder = 0;
    }

    public void updateSortOrder(int newOrder) {
        this.sortOrder = newOrder;
    }
}
