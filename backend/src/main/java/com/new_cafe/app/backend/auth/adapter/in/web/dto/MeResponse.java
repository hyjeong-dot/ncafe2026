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
public class MeResponse {
    private UUID memberId;
    private String username;
    private String name;
    private String role;
}
