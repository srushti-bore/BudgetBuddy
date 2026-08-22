package com.budgetbuddy.backend.service;

import com.budgetbuddy.backend.dto.request.CreateExpenseRequest;
import com.budgetbuddy.backend.dto.response.ExpenseResponse;
import com.budgetbuddy.backend.dto.response.ExpenseSummaryResponse;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.enums.ExpenseCategory;
import com.budgetbuddy.backend.exception.ResourceNotFoundException;
import com.budgetbuddy.backend.mapper.ExpenseMapper;
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
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense expense;
    private CreateExpenseRequest createRequest;
    private ExpenseResponse expenseResponse;

    @BeforeEach
    void setUp() {
        expense = Expense.builder()
                .id(1L)
                .title("Groceries")
                .amount(new BigDecimal("50.00"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .description("Weekly market")
                .build();

        createRequest = CreateExpenseRequest.builder()
                .title("Groceries")
                .amount(new BigDecimal("50.00"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .description("Weekly market")
                .build();

        expenseResponse = ExpenseResponse.builder()
                .id(1L)
                .title("Groceries")
                .amount(new BigDecimal("50.00"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .description("Weekly market")
                .build();
    }

    @Test
    void createExpense_Success() {
        when(expenseMapper.toEntity(any(CreateExpenseRequest.class))).thenReturn(expense);
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);
        when(expenseMapper.toResponse(any(Expense.class))).thenReturn(expenseResponse);

        ExpenseResponse result = expenseService.createExpense(createRequest);

        assertNotNull(result);
        assertEquals("Groceries", result.getTitle());
        assertEquals(new BigDecimal("50.00"), result.getAmount());
        verify(expenseRepository, times(1)).save(expense);
    }

    @Test
    void getExpenseById_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));
        when(expenseMapper.toResponse(expense)).thenReturn(expenseResponse);

        ExpenseResponse result = expenseService.getExpenseById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getExpenseById_NotFound_ThrowsException() {
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> expenseService.getExpenseById(99L));
    }

    @Test
    void getSummary_CalculatesCorrectTotal() {
        Expense e1 = Expense.builder().amount(new BigDecimal("100.00")).build();
        Expense e2 = Expense.builder().amount(new BigDecimal("50.50")).build();
        when(expenseRepository.findAll()).thenReturn(Arrays.asList(e1, e2));

        ExpenseSummaryResponse summary = expenseService.getSummary();

        assertNotNull(summary);
        assertEquals(2, summary.getExpenseCount());
        assertEquals(new BigDecimal("150.50"), summary.getTotalAmount());
    }
}
