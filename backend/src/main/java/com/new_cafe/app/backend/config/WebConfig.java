package com.new_cafe.app.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

// CORS 설정 및 정적 리소스 핸들러 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @org.springframework.beans.factory.annotation.Value("${spring.web.resources.static-locations:file:./upload/}")
    private String uploadLocation;

    // 모든 요청 URI를 로그로 남기는 필터 (디버깅용)
    @Bean
    public FilterRegistrationBean<Filter> loggingFilter() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                if (request instanceof HttpServletRequest) {
                    String uri = ((HttpServletRequest) request).getRequestURI();
                    if (uri.startsWith("/images") || uri.startsWith("/upload") || uri.contains("/api")) {
                        System.out.println("Incoming Request: " + uri);
                    }
                }
                chain.doFilter(request, response);
            }
        });
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }

    @Override
    public void addResourceHandlers(
            org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {

        String firstLocation = uploadLocation.split(",")[0].trim();
        String cleanLocation = firstLocation.replace("file:", "");
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(cleanLocation, "images").toAbsolutePath().normalize();

        // 리눅스 절대 경로에 가장 확실한 형태는 file:///절대경로/ 또는 file:/절대경로/ 입니다.
        // 여기서는 명확성을 위해 / 접두어를 보강합니다.
        String absolutePath = uploadPath.toString();
        String resourceLocation = "file:" + (absolutePath.startsWith("/") ? absolutePath : "/" + absolutePath) + "/";

        System.out.println("DEBUG: Static Resource Handler Configured:");
        System.out.println("  - Path patterns: [/images/**, /upload/images/**]");
        System.out.println("  - Physical location: " + resourceLocation);

        registry.addResourceHandler("/images/**", "/upload/images/**")
                .addResourceLocations(resourceLocation);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
