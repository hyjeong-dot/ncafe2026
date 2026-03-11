package com.new_cafe.app.backend.admin.cafe.adapter.out.persistence;

import com.new_cafe.app.backend.admin.cafe.domain.model.CafeSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeSettingsJpaRepository extends JpaRepository<CafeSettings, Long> {
}
