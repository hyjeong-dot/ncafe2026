package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AdminMenuJpaRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByOrderBySortOrderAsc();

    List<Menu> findAllByCategoryIdOrderBySortOrderAsc(Long categoryId);

    // LIKE 검색 -> 메서드 네이밍으로 변경
    List<Menu> findAllByKorNameContainingIgnoreCaseOrEngNameContainingIgnoreCaseOrderBySortOrderAsc(String korName, String engName);

    List<Menu> findAllByCategoryIdAndKorNameContainingIgnoreCaseOrCategoryIdAndEngNameContainingIgnoreCaseOrderBySortOrderAsc(Long categoryId, String korName, Long categoryId2, String engName);

    boolean existsByKorName(String korName);

    Optional<Menu> findByKorName(String korName);
}
