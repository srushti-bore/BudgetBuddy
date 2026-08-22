-- V2: Expense Indexes for fast filtering and searching

CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses (expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category     ON expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_amount       ON expenses (amount);
CREATE INDEX IF NOT EXISTS idx_expenses_title        ON expenses (title);
