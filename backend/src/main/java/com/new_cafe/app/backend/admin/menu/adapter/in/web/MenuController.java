package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.RegisterMenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.UpdateMenuRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/menu")
@RequiredArgsConstructor
public class MenuController {

    private final RegisterMenuUseCase registerMenuUseCase;
    private final GetMenuListUseCase getMenuListUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;

    @GetMapping
    public MenuListResult getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return getMenuListUseCase.getMenus(categoryId, searchQuery);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long registerMenu(@RequestBody RegisterMenuRequest request) {
        return registerMenuUseCase.registerMenu(request.toCommand());
    }

    @PutMapping("/{id}")
    public void updateMenu(@PathVariable Long id, @RequestBody UpdateMenuRequest request) {
        updateMenuUseCase.updateMenu(request.toCommand(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
    }
}
