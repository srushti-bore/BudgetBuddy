package com.budgetbuddy.backend.dto.response;

import com.budgetbuddy.backend.enums.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private ExpenseCategory category;
    private LocalDate expenseDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
