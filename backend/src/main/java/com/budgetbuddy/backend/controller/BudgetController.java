package com.budgetbuddy.backend.controller;

import com.budgetbuddy.backend.dto.request.CreateBudgetRequest;
import com.budgetbuddy.backend.dto.request.UpdateBudgetRequest;
import com.budgetbuddy.backend.dto.response.BudgetResponse;
import com.budgetbuddy.backend.dto.response.BudgetSummaryResponse;
import com.budgetbuddy.backend.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget API", description = "Operations related to budget management")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new budget")
    public BudgetResponse createBudget(@Valid @RequestBody CreateBudgetRequest request) {
        return budgetService.createBudget(request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a budget by ID")
    public BudgetResponse getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id);
    }

    @GetMapping
    @Operation(summary = "Get all budgets")
    public List<BudgetResponse> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing budget")
    public BudgetResponse updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBudgetRequest request
    ) {
        return budgetService.updateBudget(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a budget")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }

    @GetMapping("/{id}/utilization")
    @Operation(summary = "Get budget utilization summary")
    public BudgetSummaryResponse getBudgetUtilization(@PathVariable Long id) {
        return budgetService.getBudgetUtilization(id);
    }
}
