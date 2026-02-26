package com.new_cafe.app.backend.config;

import com.new_cafe.app.backend.config.jwt.JwtAuthenticationFilter;
import com.new_cafe.app.backend.config.jwt.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import lombok.RequiredArgsConstructor;
import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JWT 사용으로 세션 STATELESS 설정
                .authorizeHttpRequests(auth -> auth
                        // API 권한 설정
                        .requestMatchers("/admin/*/create").hasAuthority("MENU_ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 나머지 경로는 누구나 접근 가능
                        .anyRequest().permitAll())
                // API 서버이므로 기본 로그인 폼 비활성화
                .formLogin(form -> form.disable())
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
        users.setUsersByUsernameQuery("select nickname as username, password, true as enabled from users where nickname = ?");
        users.setAuthoritiesByUsernameQuery("select nickname as username, role authority from users where nickname = ?");
        return users;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
