package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MenuJpaRepository extends JpaRepository<Menu, Long> {
    
    @Query("SELECT m FROM Menu m WHERE " +
           "(:categoryId IS NULL OR m.categoryId = :categoryId) AND " +
           "(:searchQuery IS NULL OR m.korName LIKE %:searchQuery% OR m.engName LIKE %:searchQuery%) " +
           "ORDER BY m.sortOrder ASC")
    List<Menu> findAllByFilter(@Param("categoryId") Long categoryId, 
                                   @Param("searchQuery") String searchQuery);
}
