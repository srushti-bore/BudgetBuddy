package com.budgetbuddy.backend.service;

import com.budgetbuddy.backend.dto.request.CreateBudgetRequest;
import com.budgetbuddy.backend.dto.response.BudgetResponse;
import com.budgetbuddy.backend.dto.response.BudgetSummaryResponse;
import com.budgetbuddy.backend.entity.Budget;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.enums.BudgetPeriod;
import com.budgetbuddy.backend.exception.InvalidRequestException;
import com.budgetbuddy.backend.exception.ResourceNotFoundException;
import com.budgetbuddy.backend.mapper.BudgetMapper;
import com.budgetbuddy.backend.repository.BudgetRepository;
import com.budgetbuddy.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private BudgetMapper budgetMapper;

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private BudgetService budgetService;

    private Budget budget;
    private CreateBudgetRequest createRequest;
    private BudgetResponse budgetResponse;

    @BeforeEach
    void setUp() {
        LocalDate now = LocalDate.now();
        budget = Budget.builder()
                .id(1L)
                .name("July Budget")
                .amount(new BigDecimal("500.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(now.withDayOfMonth(1))
                .endDate(now.withDayOfMonth(30))
                .build();

        createRequest = CreateBudgetRequest.builder()
                .name("July Budget")
                .amount(new BigDecimal("500.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(now.withDayOfMonth(1))
                .endDate(now.withDayOfMonth(30))
                .build();

        budgetResponse = BudgetResponse.builder()
                .id(1L)
                .name("July Budget")
                .amount(new BigDecimal("500.00"))
                .period(BudgetPeriod.MONTHLY)
                .startDate(now.withDayOfMonth(1))
                .endDate(now.withDayOfMonth(30))
                .build();
    }

    @Test
    void createBudget_Success() {
        when(budgetMapper.toEntity(createRequest)).thenReturn(budget);
        when(budgetRepository.save(budget)).thenReturn(budget);
        when(budgetMapper.toResponse(budget)).thenReturn(budgetResponse);

        BudgetResponse result = budgetService.createBudget(createRequest);

        assertNotNull(result);
        assertEquals("July Budget", result.getName());
    }

    @Test
    void createBudget_InvalidDates_ThrowsException() {
        createRequest.setStartDate(LocalDate.now().plusDays(10));
        createRequest.setEndDate(LocalDate.now());

        assertThrows(InvalidRequestException.class, () -> budgetService.createBudget(createRequest));
    }

    @Test
    void getBudgetUtilization_CalculatesPercentageCorrectly() {
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(budget));
        when(budgetMapper.toResponse(budget)).thenReturn(budgetResponse);

        Expense e1 = Expense.builder().amount(new BigDecimal("250.00")).build();
        when(expenseRepository.findByDateRange(any(), any())).thenReturn(Arrays.asList(e1));

        BudgetSummaryResponse result = budgetService.getBudgetUtilization(1L);

        assertNotNull(result);
        assertEquals(new BigDecimal("250.00"), result.getSpentAmount());
        assertEquals(new BigDecimal("250.00"), result.getRemainingAmount());
        assertEquals(0, new BigDecimal("50.0000").compareTo(result.getUtilizationPercentage()));
    }
}
