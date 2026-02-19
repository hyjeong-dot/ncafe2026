package com.new_cafe.app.backend.auth.application.port.in;

/**
 * 로그인 유스케이스 (Input Port / Driving Port)
 * - 외부(컨트롤러)에서 내부(서비스)로 요청할 때 사용하는 인터페이스
 * - 기술에 의존하지 않는 순수한 인터페이스
 */
public interface LoginUseCase {

    /**
     * 로그인 처리
     * @param command 로그인에 필요한 정보 (username, password)
     * @return 로그인 결과 정보
     */
    LoginResult login(LoginCommand command);

    /**
     * 로그인 요청 데이터
     */
    record LoginCommand(String username, String password) {
    }

    /**
     * 로그인 결과 데이터
     */
    record LoginResult(Long memberId, String username, String name, String role) {
    }
}
