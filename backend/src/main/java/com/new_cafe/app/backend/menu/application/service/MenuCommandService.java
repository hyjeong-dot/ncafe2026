package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.exception.MenuNotFoundException;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MenuCommandService implements RegisterMenuUseCase, UpdateMenuUseCase, DeleteMenuUseCase {

    private final SaveMenuPort saveMenuPort;
    private final DeleteMenuPort deleteMenuPort;
    private final LoadMenuPort loadMenuPort;

    public MenuCommandService(SaveMenuPort saveMenuPort, 
                              DeleteMenuPort deleteMenuPort, 
                              LoadMenuPort loadMenuPort) {
        this.saveMenuPort = saveMenuPort;
        this.deleteMenuPort = deleteMenuPort;
        this.loadMenuPort = loadMenuPort;
    }

    @Override
    public Long registerMenu(RegisterMenuCommand command) {
        Menu menu = Menu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.getIsAvailable())
                .isSoldOut(false)
                .sortOrder(command.getSortOrder())
                .build();
        
        return saveMenuPort.save(menu);
    }

    @Override
    public void updateMenu(UpdateMenuCommand command) {
        Menu menu = loadMenuPort.findById(command.getId())
                .orElseThrow(() -> new MenuNotFoundException(command.getId()));

        if (command.getKorName() != null) menu.setKorName(command.getKorName());
        if (command.getEngName() != null) menu.setEngName(command.getEngName());
        if (command.getDescription() != null) menu.setDescription(command.getDescription());
        if (command.getPrice() != null) menu.changePrice(command.getPrice());
        if (command.getCategoryId() != null) menu.setCategoryId(command.getCategoryId());
        if (command.getIsAvailable() != null) menu.setIsAvailable(command.getIsAvailable());
        if (command.getIsSoldOut() != null) menu.setIsSoldOut(command.getIsSoldOut());
        if (command.getSortOrder() != null) menu.setSortOrder(command.getSortOrder());

        saveMenuPort.save(menu);
    }

    @Override
    public void deleteMenu(Long id) {
        loadMenuPort.findById(id)
                .orElseThrow(() -> new MenuNotFoundException(id));
        
        deleteMenuPort.deleteById(id);
    }
}
