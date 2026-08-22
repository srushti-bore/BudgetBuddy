package com.budgetbuddy.backend.controller;

import com.budgetbuddy.backend.dto.response.AnalyticsResponse;
import com.budgetbuddy.backend.dto.response.CategorySpendingResponse;
import com.budgetbuddy.backend.dto.response.MonthlySpendingResponse;
import com.budgetbuddy.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics API", description = "Operations related to spending analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "Get full analytics summary (dashboard)")
    public AnalyticsResponse getSummary() {
        return analyticsService.getAnalyticsSummary();
    }

    @GetMapping("/category")
    @Operation(summary = "Get category breakdown only")
    public List<CategorySpendingResponse> getCategoryBreakdown() {
        return analyticsService.getCategoryBreakdown();
    }

    @GetMapping("/monthly")
    @Operation(summary = "Get monthly reports only")
    public List<MonthlySpendingResponse> getMonthlyReports() {
        return analyticsService.getMonthlyReports();
    }
}
