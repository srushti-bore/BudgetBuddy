package com.budgetbuddy.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Universal CORS configuration supporting Vercel, Render, local dev, and cloud deployments.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // If specific comma-separated origins are given (e.g. https://my-site.vercel.app), use them; otherwise allow all patterns
                String[] origins = allowedOrigins.split("\\s*,\\s*");
                
                registry.addMapping("/**")
                        .allowedOriginPatterns(origins.length > 0 && !allowedOrigins.equals("*") ? origins : new String[]{"*"})
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
