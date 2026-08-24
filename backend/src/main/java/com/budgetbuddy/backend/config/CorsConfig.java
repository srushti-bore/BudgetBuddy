package com.budgetbuddy.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Universal CORS configuration — allows all origins, methods, and headers.
 * Uses CorsFilter (not WebMvcConfigurer) to ensure it runs before Spring Security
 * and handles OPTIONS preflight correctly on Render + Vercel deployments.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow all origins using pattern (compatible with allowCredentials)
        config.addAllowedOriginPattern("*");

        // Allow all HTTP methods including OPTIONS preflight
        config.addAllowedMethod("*");

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow cookies / auth headers
        config.setAllowCredentials(true);

        // Cache preflight for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
