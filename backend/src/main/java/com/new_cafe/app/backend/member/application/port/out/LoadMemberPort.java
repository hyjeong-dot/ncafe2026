package com.new_cafe.app.backend.member.application.port.out;

import com.new_cafe.app.backend.member.domain.model.Member;
import java.util.Optional;

/**
 * 회원 조회 포트 (Output Port / Driven Port)
 * - 내부(서비스)에서 외부(DB)로 요청할 때 사용하는 인터페이스
 * - 실제 DB 접근 기술(JDBC, JPA 등)에 의존하지 않습니다.
 */
public interface LoadMemberPort {

    /**
     * nickname으로 회원 정보를 조회합니다.
     * @param nickname 로그인 아이디 (별명)
     * @return 회원 도메인 모델 (없으면 Optional.empty)
     */
    Optional<Member> findByNickname(String nickname);
}
