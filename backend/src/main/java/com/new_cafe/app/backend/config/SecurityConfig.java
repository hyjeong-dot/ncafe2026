package com.new_cafe.app.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (테스트 시 편의)
                .authorizeHttpRequests(auth -> auth
                        // /cookie/create 경로는 인증(로그인)된 사용자만 접근 가능
                        .requestMatchers("/cookie/create").authenticated()
                        // .requestMatchers("/admin/**").hasRole("ADMIN") //403오류, DB에서는 ROLE_ADMIN으로 저장 
                        // .requestMatchers("/admin/**/create").hasAuthority("MENU_CREATE") //403오류, DB에서
                        .requestMatchers("/cookie/session/create").authenticated()
                        // 나머지 경로는 누구나 접근 가능
                        .anyRequest().permitAll())
                // 권한이 필요한 페이지 접근 시 기본 로그인 폼으로 이동
                .formLogin(form -> form.permitAll());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
        // 사용자 정보를 가져오는 쿼리 (username, password, enabled)
        users.setUsersByUsernameQuery("select nickname as username, password, true as enabled from users where nickname = ?");
        // 권한 정보를 가져오는 쿼리 (username, authority)
        // role이 'ADMIN'인 경우 'ROLE_ADMIN'으로 변환하여 전달
        users.setAuthoritiesByUsernameQuery("select nickname as username, role authority from users where nickname = ?");
        return users;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
