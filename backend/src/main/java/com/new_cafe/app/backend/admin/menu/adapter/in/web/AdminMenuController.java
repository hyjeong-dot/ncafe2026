package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.RegisterMenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.UpdateMenuRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.ManageMenuImageUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/menus")
@RequiredArgsConstructor
public class AdminMenuController {

    private final RegisterMenuUseCase registerMenuUseCase;
    private final GetMenuListUseCase getMenuListUseCase;
    private final GetMenuUseCase getMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;
    private final ManageMenuImageUseCase manageMenuImageUseCase;

    @GetMapping
    public MenuListResult getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return getMenuListUseCase.getMenus(categoryId, searchQuery);
    }

    @GetMapping("/{id}")
    public com.new_cafe.app.backend.admin.menu.application.result.MenuResult getMenu(@PathVariable Long id) {
        return getMenuUseCase.getMenu(id);
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

    // --- 메뉴 이미지 관리 ---
    
    @GetMapping("/{id}/menu-images")
    public com.new_cafe.app.backend.admin.menu.application.result.MenuImageListResult getMenuImages(@PathVariable Long id) {
        return manageMenuImageUseCase.getImagesByMenuId(id);
    }

    @PostMapping("/{id}/menu-images")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addMenuImage(@PathVariable Long id, @RequestBody com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.AddMenuImageRequest request) {
        return manageMenuImageUseCase.addImage(request.toCommand(id));
    }

    @PatchMapping("/menu-images/{imageId}/order")
    public void updateImageOrder(@PathVariable Long imageId, @RequestParam int newOrder) {
        manageMenuImageUseCase.updateImageOrder(imageId, newOrder);
    }

    @DeleteMapping("/menu-images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMenuImage(@PathVariable Long imageId) {
        manageMenuImageUseCase.removeImage(imageId);
    }
}
