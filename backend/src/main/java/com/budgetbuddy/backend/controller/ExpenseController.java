package com.budgetbuddy.backend.controller;

import com.budgetbuddy.backend.dto.request.CreateExpenseRequest;
import com.budgetbuddy.backend.dto.request.ExpenseFilterRequest;
import com.budgetbuddy.backend.dto.request.UpdateExpenseRequest;
import com.budgetbuddy.backend.dto.response.ExpensePageResponse;
import com.budgetbuddy.backend.dto.response.ExpenseResponse;
import com.budgetbuddy.backend.dto.response.ExpenseSummaryResponse;
import com.budgetbuddy.backend.enums.ExpenseCategory;
import com.budgetbuddy.backend.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense API", description = "Operations related to expense management")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new expense")
    public ExpenseResponse createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        return expenseService.createExpense(request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an expense by ID")
    public ExpenseResponse getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @GetMapping
    @Operation(summary = "Get expenses with pagination and filtering")
    public ExpensePageResponse getExpenses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        ExpenseFilterRequest filter = ExpenseFilterRequest.builder()
                .search(search)
                .category(category)
                .fromDate(fromDate)
                .toDate(toDate)
                .minAmount(minAmount)
                .maxAmount(maxAmount)
                .build();

        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortBy));

        return expenseService.getExpenses(filter, pageRequest);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExpenseRequest request
    ) {
        return expenseService.updateExpense(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an expense")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    @GetMapping("/summary")
    @Operation(summary = "Get basic summary of all expenses (V1)")
    public ExpenseSummaryResponse getSummary() {
        return expenseService.getSummary();
    }
}
