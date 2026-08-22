package com.budgetbuddy.backend.mapper;

import com.budgetbuddy.backend.dto.request.CreateBudgetRequest;
import com.budgetbuddy.backend.dto.request.UpdateBudgetRequest;
import com.budgetbuddy.backend.dto.response.BudgetResponse;
import com.budgetbuddy.backend.entity.Budget;
import org.springframework.stereotype.Component;

@Component
public class BudgetMapper {

    public Budget toEntity(CreateBudgetRequest request) {
        if (request == null) return null;
        
        return Budget.builder()
                .name(request.getName())
                .amount(request.getAmount())
                .period(request.getPeriod())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
    }

    public void updateEntityFromRequest(UpdateBudgetRequest request, Budget budget) {
        if (request == null || budget == null) return;
        
        budget.setName(request.getName());
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
    }

    public BudgetResponse toResponse(Budget budget) {
        if (budget == null) return null;
        
        return BudgetResponse.builder()
                .id(budget.getId())
                .name(budget.getName())
                .amount(budget.getAmount())
                .period(budget.getPeriod())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}
