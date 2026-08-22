package com.budgetbuddy.backend.service;

import com.budgetbuddy.backend.dto.response.AnalyticsResponse;
import com.budgetbuddy.backend.dto.response.CategorySpendingResponse;
import com.budgetbuddy.backend.dto.response.MonthlySpendingResponse;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.enums.ExpenseCategory;
import com.budgetbuddy.backend.mapper.ExpenseMapper;
import com.budgetbuddy.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalyticsSummary() {
        List<Expense> allExpenses = expenseRepository.findAll();
        
        if (allExpenses.isEmpty()) {
            return new AnalyticsResponse(); // Empty analytics
        }

        BigDecimal totalSpending = calculateTotal(allExpenses);
        BigDecimal averageSpending = totalSpending.divide(new BigDecimal(allExpenses.size()), 2, RoundingMode.HALF_UP);
        
        Expense highestExpense = allExpenses.stream().max(Comparator.comparing(Expense::getAmount)).orElse(null);
        Expense lowestExpense = allExpenses.stream().min(Comparator.comparing(Expense::getAmount)).orElse(null);

        LocalDate now = LocalDate.now();
        
        // Daily spending (today)
        List<Expense> dailyExpenses = allExpenses.stream()
                .filter(e -> e.getExpenseDate().isEqual(now))
                .collect(Collectors.toList());
        BigDecimal dailySpending = calculateTotal(dailyExpenses);

        // Weekly spending (last 7 days)
        List<Expense> weeklyExpenses = allExpenses.stream()
                .filter(e -> e.getExpenseDate().isAfter(now.minusDays(7)) && !e.getExpenseDate().isAfter(now))
                .collect(Collectors.toList());
        BigDecimal weeklySpending = calculateTotal(weeklyExpenses);

        // Monthly spending (current month)
        List<Expense> monthlyExpenses = allExpenses.stream()
                .filter(e -> e.getExpenseDate().getYear() == now.getYear() && e.getExpenseDate().getMonth() == now.getMonth())
                .collect(Collectors.toList());
        BigDecimal monthlySpending = calculateTotal(monthlyExpenses);

        // Category breakdown
        List<CategorySpendingResponse> categoryBreakdown = getCategoryBreakdown(allExpenses, totalSpending);

        // Monthly reports
        List<MonthlySpendingResponse> monthlyReports = getMonthlyReports(allExpenses);

        return AnalyticsResponse.builder()
                .totalSpending(totalSpending)
                .averageSpending(averageSpending)
                .highestExpense(expenseMapper.toResponse(highestExpense))
                .lowestExpense(expenseMapper.toResponse(lowestExpense))
                .dailySpending(dailySpending)
                .weeklySpending(weeklySpending)
                .monthlySpending(monthlySpending)
                .categoryBreakdown(categoryBreakdown)
                .monthlyReports(monthlyReports)
                .build();
    }

    private BigDecimal calculateTotal(List<Expense> expenses) {
        return expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public List<CategorySpendingResponse> getCategoryBreakdown() {
        List<Expense> allExpenses = expenseRepository.findAll();
        BigDecimal totalSpending = calculateTotal(allExpenses);
        return getCategoryBreakdown(allExpenses, totalSpending);
    }

    private List<CategorySpendingResponse> getCategoryBreakdown(List<Expense> allExpenses, BigDecimal totalSpending) {
        Map<ExpenseCategory, List<Expense>> groupedByCategory = allExpenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory));

        List<CategorySpendingResponse> breakdown = new ArrayList<>();
        
        for (Map.Entry<ExpenseCategory, List<Expense>> entry : groupedByCategory.entrySet()) {
            BigDecimal categoryTotal = calculateTotal(entry.getValue());
            BigDecimal percentage = BigDecimal.ZERO;
            if (totalSpending.compareTo(BigDecimal.ZERO) > 0) {
                percentage = categoryTotal.divide(totalSpending, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            }
            
            breakdown.add(CategorySpendingResponse.builder()
                    .category(entry.getKey())
                    .amount(categoryTotal)
                    .percentage(percentage)
                    .build());
        }
        
        return breakdown;
    }

    @Transactional(readOnly = true)
    public List<MonthlySpendingResponse> getMonthlyReports() {
        return getMonthlyReports(expenseRepository.findAll());
    }

    private List<MonthlySpendingResponse> getMonthlyReports(List<Expense> allExpenses) {
        Map<YearMonth, List<Expense>> groupedByMonth = allExpenses.stream()
                .collect(Collectors.groupingBy(e -> YearMonth.of(e.getExpenseDate().getYear(), e.getExpenseDate().getMonth())));

        List<MonthlySpendingResponse> reports = new ArrayList<>();
        
        for (Map.Entry<YearMonth, List<Expense>> entry : groupedByMonth.entrySet()) {
            reports.add(MonthlySpendingResponse.builder()
                    .month(entry.getKey().getMonth().name())
                    .year(entry.getKey().getYear())
                    .totalAmount(calculateTotal(entry.getValue()))
                    .expenseCount(entry.getValue().size())
                    .build());
        }
        
        // Sort descending by YearMonth
        reports.sort((a, b) -> {
            YearMonth ymA = YearMonth.of(a.getYear(), java.time.Month.valueOf(a.getMonth()));
            YearMonth ymB = YearMonth.of(b.getYear(), java.time.Month.valueOf(b.getMonth()));
            return ymB.compareTo(ymA);
        });
        
        return reports;
    }
}
