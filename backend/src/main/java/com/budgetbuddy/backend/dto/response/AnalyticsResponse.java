package com.budgetbuddy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private BigDecimal dailySpending;
    private BigDecimal weeklySpending;
    private BigDecimal monthlySpending;
    private BigDecimal totalSpending;
    private BigDecimal averageSpending;
    private ExpenseResponse highestExpense;
    private ExpenseResponse lowestExpense;
    private List<CategorySpendingResponse> categoryBreakdown;
    private List<MonthlySpendingResponse> monthlyReports;
}
