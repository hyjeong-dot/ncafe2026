package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AdminMenuJpaRepository extends JpaRepository<Menu, Long> {

    // 단순 조건 → 메서드 네이밍
    List<Menu> findAllByOrderBySortOrderAsc();

    List<Menu> findAllByCategoryIdOrderBySortOrderAsc(Long categoryId);

    // LIKE 검색 → @Query (메서드 네이밍으로는 OR + LIKE 표현이 어려움)
    @Query("SELECT m FROM AdminMenu m WHERE " +
           "m.korName LIKE %:query% OR m.engName LIKE %:query% " +
           "ORDER BY m.sortOrder ASC")
    List<Menu> findAllByQuery(@Param("query") String query);

    @Query("SELECT m FROM AdminMenu m WHERE " +
           "m.categoryId = :categoryId AND " +
           "(m.korName LIKE %:query% OR m.engName LIKE %:query%) " +
           "ORDER BY m.sortOrder ASC")
    List<Menu> findAllByCategoryIdAndQuery(@Param("categoryId") Long categoryId,
                                           @Param("query") String query);
}
