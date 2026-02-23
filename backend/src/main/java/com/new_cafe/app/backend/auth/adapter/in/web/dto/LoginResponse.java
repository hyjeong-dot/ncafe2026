package com.new_cafe.app.backend.auth.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private MemberData data;

    @Data
    @AllArgsConstructor
    public static class MemberData {
        private Long memberId;
        private String username;
        private String name;
        private String role;
    }

    public static LoginResponse success(Long memberId, String username, String name, String role) {
        return LoginResponse.builder()
                .success(true)
                .data(new MemberData(memberId, username, name, role))
                .build();
    }

    public static LoginResponse fail(String message) {
        return LoginResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
