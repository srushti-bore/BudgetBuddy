package com.budgetbuddy.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Tag(name = "Health & Root API", description = "Root health status endpoint for Render/Cloud monitoring")
public class HomeController {

    @GetMapping("/")
    @Operation(summary = "Root health check")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "BudgetBuddy Backend API",
                "version", "1.0.0",
                "docs", "/swagger-ui/index.html",
                "api", "/api/v1"
        ));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
