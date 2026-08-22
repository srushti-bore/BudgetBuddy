-- V3: Budget Tracking Table

CREATE TABLE IF NOT EXISTS budgets (
    id         BIGSERIAL     PRIMARY KEY,
    name       VARCHAR(255)  NOT NULL,
    amount     NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    period     VARCHAR(50)   NOT NULL,
    start_date DATE          NOT NULL,
    end_date   DATE          NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_budget_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_budgets_date_range ON budgets (start_date, end_date);
