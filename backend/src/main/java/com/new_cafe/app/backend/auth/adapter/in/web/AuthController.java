package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase.LoginResult;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 로그인 컨트롤러 (Input Adapter / Driving Adapter)
 * - 외부 HTTP 요청을 받아 Input Port(LoginUseCase)에 전달합니다.
 * - 서비스 구현체에 직접 의존하지 않고, 인터페이스(포트)에만 의존합니다.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;

    public AuthController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    /**
     * POST /auth/login
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginCommand command = new LoginCommand(
                    request.getUsername(),
                    request.getPassword()
            );

            LoginResult result = loginUseCase.login(command);

            return ResponseEntity.ok(
                    LoginResponse.success(
                            result.memberId(),
                            result.username(),
                            result.name(),
                            result.role()
                    )
            );
        } catch (AuthenticationFailedException e) {
            return ResponseEntity.status(401).body(
                    LoginResponse.fail(e.getMessage())
            );
        }
    }
}
