package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginRequest;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginResponse;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.MeResponse;
import com.new_cafe.app.backend.auth.application.port.in.DeleteAccountUseCase;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.result.LoginResult;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.config.jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final DeleteAccountUseCase deleteAccountUseCase;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResult result = loginUseCase.login(request.toCommand());

        // Generate JWT Token
        String token = jwtProvider.generateToken(result.getUsername(), result.getRole());

        // Add JWT to HTTP-Only Cookie
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400); // 1 day
        response.addCookie(cookie);

        return LoginResponse.builder()
                .memberId(result.getMemberId())
                .username(result.getUsername())
                .name(result.getName())
                .role(result.getRole())
                .token(token)
                .build();
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public java.util.UUID signup(@RequestBody SignupRequest request) {
        return signupUseCase.signup(request.toCommand()).getMemberId();
    }

    @GetMapping("/me")
    public MeResponse getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AuthenticationFailedException();
        }

        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // Basic user info based on JWT
        return MeResponse.builder()
                .memberId(UUID.fromString("00000000-0000-0000-0000-000000000000"))
                .username(auth.getName())
                .name("User")
                .role(role)
                .build();
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AuthenticationFailedException();
        }

        deleteAccountUseCase.deleteAccount(auth.getName());
        
        // Clear JWT Token cookie
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
