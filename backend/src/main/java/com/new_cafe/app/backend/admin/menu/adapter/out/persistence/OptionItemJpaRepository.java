package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OptionItemJpaRepository extends JpaRepository<OptionItem, Long> {
    List<OptionItem> findAllByOptionIdOrderBySortOrderAsc(Long optionId);
    void deleteByOptionId(Long optionId);
}
