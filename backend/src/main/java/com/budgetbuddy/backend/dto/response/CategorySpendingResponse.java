package com.budgetbuddy.backend.dto.response;

import com.budgetbuddy.backend.enums.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySpendingResponse {
    private ExpenseCategory category;
    private BigDecimal amount;
    private BigDecimal percentage;
}
