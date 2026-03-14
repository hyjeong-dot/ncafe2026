package com.new_cafe.app.backend.menu.adapter.out.persistence;

import com.new_cafe.app.backend.menu.domain.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MenuJpaRepository extends JpaRepository<Menu, Long> {

    // 판매 가능한 메뉴 전체 조회
    List<Menu> findAllByIsAvailableTrueOrderBySortOrderAsc();

    // 카테고리별 판매 가능한 메뉴 조회
    List<Menu> findAllByIsAvailableTrueAndCategoryIdOrderBySortOrderAsc(Long categoryId);

    // 검색어 기반 판매 가능한 메뉴 조회 (이름 또는 설명)
    List<Menu> findAllByIsAvailableTrueAndKorNameContainingIgnoreCaseOrIsAvailableTrueAndDescriptionContainingIgnoreCaseOrderBySortOrderAsc(String korName, String description);

    // 카테고리 + 검색어 기반 판매 가능한 메뉴 조회
    List<Menu> findAllByIsAvailableTrueAndCategoryIdAndKorNameContainingIgnoreCaseOrIsAvailableTrueAndCategoryIdAndDescriptionContainingIgnoreCaseOrderBySortOrderAsc(Long categoryId, String korName, Long categoryId2, String description);

    // 판매 가능한 메뉴 단건 조회 (ID)
    Optional<Menu> findByIdAndIsAvailableTrue(Long id);

    // 판매 가능한 메뉴 단건 조회 (slug)
    Optional<Menu> findBySlugAndIsAvailableTrue(String slug);
}
