package com.new_cafe.app.backend.menu.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class MenuImageListResult {
    private final List<MenuImageResult> images;
}
