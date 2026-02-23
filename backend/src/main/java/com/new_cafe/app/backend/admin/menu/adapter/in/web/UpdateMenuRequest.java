package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateAdminMenuUseCase.UpdateAdminMenuCommand;
import lombok.Data;

@Data
public class UpdateMenuRequest {
    private String korName;
    private String engName;
    private String description;
    private int price;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;

    public UpdateAdminMenuCommand toCommand(Long id) {
        return UpdateAdminMenuCommand.builder()
                .id(id)
                .korName(korName)
                .engName(engName)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .isAvailable(isAvailable)
                .isSoldOut(isSoldOut)
                .sortOrder(sortOrder)
                .build();
    }
}
