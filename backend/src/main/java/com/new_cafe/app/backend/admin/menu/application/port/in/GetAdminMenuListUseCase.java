package com.new_cafe.app.backend.admin.menu.application.port.in;

import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.time.LocalDateTime;

public interface GetAdminMenuListUseCase {
    AdminMenuListResponse getAdminMenus(Long categoryId, String searchQuery);
}
