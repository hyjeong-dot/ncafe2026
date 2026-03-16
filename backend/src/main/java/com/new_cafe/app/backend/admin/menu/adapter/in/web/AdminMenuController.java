package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.RegisterMenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.UpdateMenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.SaveMenuOptionsRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.ManageMenuImageUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuOptionPort;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.AddMenuImageRequest;
import com.new_cafe.app.backend.admin.menu.application.result.MenuImageListResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuOptionResult;
import com.new_cafe.app.backend.admin.menu.application.result.OptionItemResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.admin.menu.domain.model.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.model.OptionItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    private final MenuOptionPort menuOptionPort;

    @GetMapping
    public MenuListResult getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String searchQuery) {
        return getMenuListUseCase.getMenus(categoryId, searchQuery);
    }

    @GetMapping("/{id}")
    public MenuResult getMenu(@PathVariable Long id) {
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

    @PatchMapping("/{id}/sold-out")
    public void toggleSoldOut(@PathVariable Long id) {
        updateMenuUseCase.toggleSoldOut(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
    }

    // --- 메뉴 이미지 관리 ---
    
    @GetMapping("/{id}/menu-images")
    public MenuImageListResult getMenuImages(@PathVariable Long id) {
        return manageMenuImageUseCase.getImagesByMenuId(id);
    }

    @PostMapping("/{id}/menu-images")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addMenuImage(@PathVariable Long id, @RequestBody AddMenuImageRequest request) {
        return manageMenuImageUseCase.addImage(request.toCommand(id));
    }

    @PatchMapping("/menu-images/{imageId}/order")
    public void updateImageOrder(@PathVariable Long imageId, @RequestParam int newOrder) {
        manageMenuImageUseCase.updateImageOrder(imageId, newOrder);
    }

    @PatchMapping("/{id}/menu-images/{imageId}/primary")
    public void setPrimaryImage(@PathVariable Long id, @PathVariable Long imageId) {
        manageMenuImageUseCase.setPrimaryImage(id, imageId);
    }

    @DeleteMapping("/menu-images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMenuImage(@PathVariable Long imageId) {
        manageMenuImageUseCase.removeImage(imageId);
    }

    // --- 메뉴 옵션 관리 ---

    @GetMapping("/{id}/options")
    public List<MenuOptionResult> getMenuOptions(@PathVariable Long id) {
        List<MenuOption> options = menuOptionPort.findAllByMenuId(id);
        return options.stream().map(opt -> {
            List<OptionItem> items = menuOptionPort.findAllByOptionId(opt.getId());
            List<OptionItemResult> itemResults = items.stream()
                    .map(item -> OptionItemResult.builder()
                            .id(item.getId())
                            .optionId(opt.getId())
                            .name(item.getName())
                            .priceDelta(item.getPriceDelta())
                            .sortOrder(item.getSortOrder())
                            .build())
                    .collect(Collectors.toList());
            return MenuOptionResult.builder()
                    .id(opt.getId())
                    .menuId(opt.getMenuId())
                    .name(opt.getName())
                    .isRequired(opt.getIsRequired())
                    .isMultiSelect(opt.getIsMultiSelect())
                    .sortOrder(opt.getSortOrder())
                    .items(itemResults)
                    .build();
        }).collect(Collectors.toList());
    }

    @PutMapping("/{id}/options")
    @Transactional
    public void saveMenuOptions(@PathVariable Long id, @RequestBody SaveMenuOptionsRequest request) {
        // 기존 옵션 전체 삭제
        menuOptionPort.deleteByMenuId(id);

        // 새 옵션 저장
        if (request.getOptions() != null) {
            for (int i = 0; i < request.getOptions().size(); i++) {
                SaveMenuOptionsRequest.OptionGroupRequest group = request.getOptions().get(i);
                MenuOption option = MenuOption.builder()
                        .menuId(id)
                        .name(group.getName())
                        .isRequired(group.isRequired())
                        .isMultiSelect("checkbox".equals(group.getType()))
                        .sortOrder(i)
                        .build();
                MenuOption saved = menuOptionPort.saveOption(option);

                if (group.getItems() != null) {
                    for (int j = 0; j < group.getItems().size(); j++) {
                        SaveMenuOptionsRequest.OptionItemRequest itemReq = group.getItems().get(j);
                        OptionItem item = OptionItem.builder()
                                .optionId(saved.getId())
                                .name(itemReq.getName())
                                .priceDelta(itemReq.getPriceDelta())
                                .sortOrder(j)
                                .build();
                        menuOptionPort.saveItem(item);
                    }
                }
            }
        }
    }
}

