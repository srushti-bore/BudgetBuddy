package com.budgetbuddy.backend.service;

import com.budgetbuddy.backend.dto.request.CreateBudgetRequest;
import com.budgetbuddy.backend.dto.request.UpdateBudgetRequest;
import com.budgetbuddy.backend.dto.response.BudgetResponse;
import com.budgetbuddy.backend.dto.response.BudgetSummaryResponse;
import com.budgetbuddy.backend.entity.Budget;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.exception.InvalidRequestException;
import com.budgetbuddy.backend.exception.ResourceNotFoundException;
import com.budgetbuddy.backend.mapper.BudgetMapper;
import com.budgetbuddy.backend.repository.BudgetRepository;
import com.budgetbuddy.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;
    private final ExpenseRepository expenseRepository;

    @Transactional
    public BudgetResponse createBudget(CreateBudgetRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new InvalidRequestException("Start date cannot be after end date");
        }
        Budget budget = budgetMapper.toEntity(request);
        Budget savedBudget = budgetRepository.save(budget);
        return budgetMapper.toResponse(savedBudget);
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        return budgetMapper.toResponse(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getAllBudgets() {
        return budgetRepository.findAll().stream()
                .map(budgetMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, UpdateBudgetRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new InvalidRequestException("Start date cannot be after end date");
        }
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetMapper.updateEntityFromRequest(request, budget);
        Budget updatedBudget = budgetRepository.save(budget);
        return budgetMapper.toResponse(updatedBudget);
    }

    @Transactional
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public BudgetSummaryResponse getBudgetUtilization(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        // Get expenses within the budget date range
        List<Expense> expenses = expenseRepository.findByDateRange(budget.getStartDate(), budget.getEndDate());

        BigDecimal spentAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remainingAmount = budget.getAmount().subtract(spentAmount);
        
        BigDecimal utilizationPercentage = BigDecimal.ZERO;
        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            utilizationPercentage = spentAmount.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        return BudgetSummaryResponse.builder()
                .budget(budgetMapper.toResponse(budget))
                .spentAmount(spentAmount)
                .remainingAmount(remainingAmount)
                .utilizationPercentage(utilizationPercentage)
                .build();
    }
}
