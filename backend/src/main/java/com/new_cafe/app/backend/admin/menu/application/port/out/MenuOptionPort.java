package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import java.util.List;

public interface MenuOptionPort {
    List<MenuOption> findAllByMenuId(Long menuId);
    List<OptionItem> findAllByOptionId(Long optionId);
    MenuOption saveOption(MenuOption option);
    OptionItem saveItem(OptionItem item);
    void deleteByMenuId(Long menuId);
}
