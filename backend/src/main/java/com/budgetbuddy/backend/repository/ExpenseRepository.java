package com.budgetbuddy.backend.repository;

import com.budgetbuddy.backend.entity.Expense;
import com.budgetbuddy.backend.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    
    @Query("SELECT e FROM Expense e WHERE e.expenseDate >= :startDate AND e.expenseDate <= :endDate")
    List<Expense> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByCategory(ExpenseCategory category);
}
