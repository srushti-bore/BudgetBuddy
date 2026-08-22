# BudgetBuddy Database Documentation & Schema Guide

This directory contains the database migration scripts, initial schema files, and documentation for **BudgetBuddy** (Versions 1 through 3).

---

## 🗄️ Database Architecture & Migrations

BudgetBuddy uses **Flyway** for version-controlled, reproducible SQL database migrations.

The migration scripts are located in:
- `backend/src/main/resources/db/migration/` (executed automatically by Flyway on Spring Boot startup)
- `database/migrations/` (backup copy)

### Version Summary

| Version | File Name | Description | Key Objects |
|---|---|---|---|
| **V1** | `V1__initial_schema.sql` | Core Expense Tracker Schema | Table `expenses` |
| **V2** | `V2__expense_indexes.sql` | Search & Filter Optimization Indexes | Indexes on `expense_date`, `category`, `amount`, `title` |
| **V3** | `V3__budget_schema.sql` | Budget Tracking Schema | Table `budgets`, index on `(start_date, end_date)` |

---

## 📋 Table Definitions

### 1. `expenses` Table (V1)
```sql
CREATE TABLE expenses (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    amount       NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    category     VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    description  TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `budgets` Table (V3)
```sql
CREATE TABLE budgets (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    amount      NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    period      VARCHAR(50) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_budget_dates CHECK (end_date >= start_date)
);
```

---

## ⚡ Deployment Guides

### Option A: Local PostgreSQL Setup (Current)
1. Ensure PostgreSQL is running on `localhost:5432`.
2. Configure `.env` in `backend/`:
   ```properties
   DATABASE_URL=jdbc:postgresql://localhost:5432/budgetbuddy
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   ```
3. Start the backend (`mvn spring-boot:run`).
4. **`DatabaseInitializer`** will automatically create the `budgetbuddy` database if missing, and **Flyway** will apply all migrations.

### Option B: Deploying to Supabase (Future)
When you are ready to migrate to **Supabase**:
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to **Project Settings → Database** and copy the Transaction Pooler or Direct Connection String:
   ```text
   jdbc:postgresql://db.<your-project-ref>.supabase.co:5432/postgres?sslmode=require
   ```
3. Update your `.env` file in `backend/`:
   ```properties
   DATABASE_URL=jdbc:postgresql://db.<your-project-ref>.supabase.co:5432/postgres?sslmode=require
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_supabase_db_password
   ```
4. Restart the Spring Boot app. Flyway will automatically run the same V1-V3 migrations on your Supabase PostgreSQL instance!
