package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class SaveMenuOptionsRequest {

    private List<OptionGroupRequest> options;

    @Data
    @NoArgsConstructor
    public static class OptionGroupRequest {
        private String name;
        private String type; // "radio" or "checkbox"
        private boolean required;
        private List<OptionItemRequest> items;
    }

    @Data
    @NoArgsConstructor
    public static class OptionItemRequest {
        private String name;
        private int priceDelta;
    }
}
