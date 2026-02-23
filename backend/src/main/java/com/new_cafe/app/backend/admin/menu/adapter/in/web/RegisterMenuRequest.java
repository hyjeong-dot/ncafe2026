package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.application.port.in.RegisterMenuUseCase.RegisterMenuCommand;
import lombok.Data;

@Data
public class RegisterMenuRequest {
    private String korName;
    private String engName;
    private String description;
    private int price;
    private Long categoryId;
    private Boolean isAvailable;
    private Integer sortOrder;

    public RegisterMenuCommand toCommand() {
        return RegisterMenuCommand.builder()
                .korName(korName)
                .engName(engName)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .isAvailable(isAvailable)
                .sortOrder(sortOrder)
                .build();
    }
}
