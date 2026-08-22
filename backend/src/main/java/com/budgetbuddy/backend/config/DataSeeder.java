package com.budgetbuddy.backend.config;

import com.budgetbuddy.backend.entity.Budget;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.enums.BudgetPeriod;
import com.budgetbuddy.backend.enums.ExpenseCategory;
import com.budgetbuddy.backend.repository.BudgetRepository;
import com.budgetbuddy.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * DataSeeder runs automatically on startup.
 * If the database has no expenses or budgets, it populates realistic
 * sample data so the application, charts, and dashboards are immediately alive.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    @Override
    public void run(String... args) {
        if (expenseRepository.count() == 0) {
            log.info("Database is empty. Seeding sample expenses and budgets...");
            seedSampleExpenses();
            seedSampleBudgets();
            log.info("✅ Sample data successfully seeded!");
        } else {
            log.info("Database already contains data. Skipping sample seeding.");
        }
    }

    private void seedSampleExpenses() {
        LocalDate today = LocalDate.now();

        List<Expense> sampleExpenses = Arrays.asList(
            Expense.builder()
                .title("Weekly Grocery Shopping")
                .amount(new BigDecimal("145.50"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(today.minusDays(1))
                .description("Supermarket haul for fresh fruits, vegetables, and milk")
                .build(),
            Expense.builder()
                .title("Monthly Electricity Bill")
                .amount(new BigDecimal("82.00"))
                .category(ExpenseCategory.BILLS)
                .expenseDate(today.minusDays(3))
                .description("Utilities payment for electricity")
                .build(),
            Expense.builder()
                .title("Gas Station Fuel")
                .amount(new BigDecimal("45.00"))
                .category(ExpenseCategory.TRANSPORT)
                .expenseDate(today.minusDays(5))
                .description("Full tank refill")
                .build(),
            Expense.builder()
                .title("New Running Shoes")
                .amount(new BigDecimal("120.00"))
                .category(ExpenseCategory.SHOPPING)
                .expenseDate(today.minusDays(8))
                .description("Nike athletic shoes")
                .build(),
            Expense.builder()
                .title("Movie Night & Popcorn")
                .amount(new BigDecimal("35.00"))
                .category(ExpenseCategory.ENTERTAINMENT)
                .expenseDate(today.minusDays(10))
                .description("Cinema tickets and snacks")
                .build(),
            Expense.builder()
                .title("Pharmacy Prescriptions")
                .amount(new BigDecimal("28.40"))
                .category(ExpenseCategory.HEALTH)
                .expenseDate(today.minusDays(12))
                .description("Vitamins and supplements")
                .build(),
            Expense.builder()
                .title("Dinner with Friends")
                .amount(new BigDecimal("68.90"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(today.minusDays(15))
                .description("Italian restaurant dinner")
                .build(),
            Expense.builder()
                .title("Internet Service Bill")
                .amount(new BigDecimal("60.00"))
                .category(ExpenseCategory.BILLS)
                .expenseDate(today.minusDays(18))
                .description("High-speed fiber internet subscription")
                .build(),
            Expense.builder()
                .title("Uber Ride to Airport")
                .amount(new BigDecimal("32.50"))
                .category(ExpenseCategory.TRANSPORT)
                .expenseDate(today.minusDays(22))
                .description("Ride share")
                .build()
        );

        expenseRepository.saveAll(sampleExpenses);
    }

    private void seedSampleBudgets() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        List<Budget> sampleBudgets = Arrays.asList(
            Budget.builder()
                .name("Monthly Food & Dining Limit")
                .amount(new BigDecimal("500.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(startOfMonth)
                .endDate(endOfMonth)
                .build(),
            Budget.builder()
                .name("Monthly Utilities & Bills")
                .amount(new BigDecimal("300.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(startOfMonth)
                .endDate(endOfMonth)
                .build(),
            Budget.builder()
                .name("Weekly Transportation Budget")
                .amount(new BigDecimal("100.00"))
                .period(BudgetPeriod.WEEKLY)
                .startDate(today.minusDays(3))
                .endDate(today.plusDays(4))
                .build()
        );

        budgetRepository.saveAll(sampleBudgets);
    }
}
