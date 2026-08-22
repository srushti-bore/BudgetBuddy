-- ============================================================
-- BudgetBuddy Database Initialization Script
-- Run this file in pgAdmin Query Tool
-- Step 1: Connect to the "budgetbuddy" database in pgAdmin
-- Step 2: Open Query Tool and paste + run this entire script
-- ============================================================

-- ============================================================
-- V1: Core Expense Tracker Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS expenses (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    amount      NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    category    VARCHAR(50)  NOT NULL,
    expense_date DATE        NOT NULL,
    description TEXT,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- V2: Expense Filtering Indexes (performance optimizations)
-- ============================================================

-- Fast lookup by date (most common filter)
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date
    ON expenses (expense_date DESC);

-- Fast lookup by category
CREATE INDEX IF NOT EXISTS idx_expenses_category
    ON expenses (category);

-- Fast lookup by amount range
CREATE INDEX IF NOT EXISTS idx_expenses_amount
    ON expenses (amount);

-- Fast full-text search on title
CREATE INDEX IF NOT EXISTS idx_expenses_title
    ON expenses (title);

-- ============================================================
-- V3: Budget Tracking Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS budgets (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    amount      NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    period      VARCHAR(50)  NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_budget_dates CHECK (end_date >= start_date)
);

-- Index for date range queries (used for budget utilization calculation)
CREATE INDEX IF NOT EXISTS idx_budgets_date_range
    ON budgets (start_date, end_date);

-- ============================================================
-- Verify all tables were created successfully
-- ============================================================
SELECT
    table_name,
    (SELECT count(*) FROM information_schema.columns c
     WHERE c.table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
