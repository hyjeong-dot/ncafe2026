package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.RegisterMenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.UpdateMenuRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.ManageMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/menu")
@RequiredArgsConstructor
public class MenuController {

    private final ManageMenuUseCase manageMenuUseCase;

    @GetMapping
    public MenuListResult getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return manageMenuUseCase.getMenus(categoryId, searchQuery);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long registerMenu(@RequestBody RegisterMenuRequest request) {
        return manageMenuUseCase.registerMenu(request.toCommand());
    }

    @PutMapping("/{id}")
    public void updateMenu(@PathVariable Long id, @RequestBody UpdateMenuRequest request) {
        manageMenuUseCase.updateMenu(request.toCommand(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        manageMenuUseCase.deleteMenu(id);
    }
}
