package com.budgetbuddy.backend.service;

import com.budgetbuddy.backend.dto.request.CreateExpenseRequest;
import com.budgetbuddy.backend.dto.request.ExpenseFilterRequest;
import com.budgetbuddy.backend.dto.request.UpdateExpenseRequest;
import com.budgetbuddy.backend.dto.response.ExpensePageResponse;
import com.budgetbuddy.backend.dto.response.ExpenseResponse;
import com.budgetbuddy.backend.dto.response.ExpenseSummaryResponse;
import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.exception.ResourceNotFoundException;
import com.budgetbuddy.backend.mapper.ExpenseMapper;
import com.budgetbuddy.backend.repository.ExpenseRepository;
import com.budgetbuddy.backend.specification.ExpenseSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        Expense savedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return expenseMapper.toResponse(expense);
    }

    @Transactional(readOnly = true)
    public ExpensePageResponse getExpenses(ExpenseFilterRequest filter, Pageable pageable) {
        Specification<Expense> spec = ExpenseSpecification.getFilterSpecification(filter);
        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());

        return ExpensePageResponse.builder()
                .content(content)
                .page(expensePage.getNumber())
                .size(expensePage.getSize())
                .totalElements(expensePage.getTotalElements())
                .totalPages(expensePage.getTotalPages())
                .build();
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expenseMapper.updateEntityFromRequest(request, expense);
        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getSummary() {
        List<Expense> allExpenses = expenseRepository.findAll();
        BigDecimal totalAmount = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ExpenseSummaryResponse.builder()
                .totalAmount(totalAmount)
                .expenseCount(allExpenses.size())
                .build();
    }
}
