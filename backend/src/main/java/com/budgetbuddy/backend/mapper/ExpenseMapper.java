package com.budgetbuddy.backend.mapper;

import com.budgetbuddy.backend.dto.request.CreateExpenseRequest;
import com.budgetbuddy.backend.dto.request.UpdateExpenseRequest;
import com.budgetbuddy.backend.dto.response.ExpenseResponse;
import com.budgetbuddy.backend.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public Expense toEntity(CreateExpenseRequest request) {
        if (request == null) return null;
        
        return Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .build();
    }

    public void updateEntityFromRequest(UpdateExpenseRequest request, Expense expense) {
        if (request == null || expense == null) return;
        
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
    }

    public ExpenseResponse toResponse(Expense expense) {
        if (expense == null) return null;
        
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
