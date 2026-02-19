package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.Menu;

public interface SaveMenuPort {
    Long save(Menu menu);
}
