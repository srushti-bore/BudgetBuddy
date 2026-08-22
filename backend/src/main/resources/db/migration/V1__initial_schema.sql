-- V1: Core Expenses Table

CREATE TABLE IF NOT EXISTS expenses (
    id           BIGSERIAL    PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    amount       NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    category     VARCHAR(50)  NOT NULL,
    expense_date DATE         NOT NULL,
    description  TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
