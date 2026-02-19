package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.auth.domain.model.Member;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 회원 영속성 어댑터 (Output Adapter / Driven Adapter)
 * - LoadMemberPort 인터페이스를 구현합니다.
 * - 실제 DB 접근 기술(JdbcTemplate)을 사용합니다.
 * - 나중에 JPA, MyBatis 등으로 교체해도 서비스 계층은 영향을 받지 않습니다.
 */
@Repository
public class MemberPersistenceAdapter implements LoadMemberPort {

    private final JdbcTemplate jdbcTemplate;

    public MemberPersistenceAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Member> memberRowMapper = (rs, rowNum) -> {
        Member member = new Member();
        member.setId(rs.getLong("id"));
        member.setUsername(rs.getString("username"));
        member.setPassword(rs.getString("password"));
        member.setName(rs.getString("name"));
        member.setRole(rs.getString("role"));
        return member;
    };

    @Override
    public Optional<Member> findByUsername(String username) {
        String sql = "SELECT id, username, password, name, role FROM member WHERE username = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, username);
        return members.stream().findFirst();
    }
}
