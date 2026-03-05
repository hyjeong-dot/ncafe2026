package com.new_cafe.app.backend.auth.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

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
        private UUID memberId;
        private String username;
        private String name;
        private String role;
        private String token;
    }

    public static LoginResponse success(UUID memberId, String username, String name, String role, String token) {
        return LoginResponse.builder()
                .success(true)
                .data(new MemberData(memberId, username, name, role, token))
                .build();
    }

    public static LoginResponse fail(String message) {
        return LoginResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
