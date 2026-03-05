package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginRequest;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginResponse;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.result.LoginResult;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.config.jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final SignupUseCase signupUseCase;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            LoginResult result = loginUseCase.login(request.toCommand());

            // Generate JWT Token
            String token = jwtProvider.generateToken(result.getUsername(), result.getRole());

            // Add JWT to HTTP-Only Cookie
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 1 day
            response.addCookie(cookie);

            return ResponseEntity.ok(
                    LoginResponse.success(
                            result.getMemberId(),
                            result.getUsername(),
                            result.getName(),
                            result.getRole(),
                            token
                    )
            );
        } catch (AuthenticationFailedException e) {
            return ResponseEntity.status(401).body(
                    LoginResponse.fail(e.getMessage())
            );
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            signupUseCase.signup(request.toCommand());
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "회원가입 완료!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // Basic user info based on JWT
        return ResponseEntity.ok(
                LoginResponse.success(
                        UUID.fromString("00000000-0000-0000-0000-000000000000"),
                        auth.getName(),
                        "User",
                        role,
                        null
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }
}
