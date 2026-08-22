package com.budgetbuddy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySpendingResponse {
    private String month;
    private int year;
    private BigDecimal totalAmount;
    private long expenseCount;
}
