package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.application.port.in.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/menu")
@RequiredArgsConstructor
public class AdminMenuController {

    private final RegisterMenuUseCase registerMenuUseCase;
    private final GetAdminMenuListUseCase getAdminMenuListUseCase;
    private final UpdateAdminMenuUseCase updateAdminMenuUseCase;
    private final DeleteAdminMenuUseCase deleteAdminMenuUseCase;

    @GetMapping
    public GetAdminMenuListUseCase.AdminMenuListResponse getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return getAdminMenuListUseCase.getAdminMenus(categoryId, searchQuery);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long registerMenu(@RequestBody RegisterMenuRequest request) {
        return registerMenuUseCase.registerMenu(request.toCommand());
    }

    @PutMapping("/{id}")
    public void updateMenu(@PathVariable Long id, @RequestBody UpdateMenuRequest request) {
        updateAdminMenuUseCase.updateMenu(request.toCommand(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        deleteAdminMenuUseCase.deleteMenu(id);
    }
}
