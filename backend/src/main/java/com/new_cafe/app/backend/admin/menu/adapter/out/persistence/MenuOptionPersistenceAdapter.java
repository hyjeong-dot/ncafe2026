package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuOptionPort;
import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component("adminMenuOptionPersistenceAdapter")
@RequiredArgsConstructor
public class MenuOptionPersistenceAdapter implements MenuOptionPort {

    private final MenuOptionJpaRepository menuOptionRepository;
    private final OptionItemJpaRepository optionItemRepository;

    @Override
    public List<MenuOption> findAllByMenuId(Long menuId) {
        return menuOptionRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
    }

    @Override
    public List<OptionItem> findAllByOptionId(Long optionId) {
        return optionItemRepository.findAllByOptionIdOrderBySortOrderAsc(optionId);
    }

    @Override
    public MenuOption saveOption(MenuOption option) {
        return menuOptionRepository.save(option);
    }

    @Override
    public OptionItem saveItem(OptionItem item) {
        return optionItemRepository.save(item);
    }

    @Override
    @Transactional
    public void deleteByMenuId(Long menuId) {
        List<MenuOption> options = menuOptionRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        for (MenuOption option : options) {
            optionItemRepository.deleteByOptionId(option.getId());
        }
        menuOptionRepository.deleteByMenuId(menuId);
    }
}
