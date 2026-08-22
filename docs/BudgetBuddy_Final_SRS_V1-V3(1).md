# BudgetBuddy — Software Requirements Specification (Final)

**Product Name:** BudgetBuddy  
**Previous Project Name:** PennyPilot  
**Scope:** V1 to V3  
**Backend:** Spring Boot + Spring Data JPA  
**Frontend:** React + Vite  
**Database:** PostgreSQL  
**API Style:** REST / JSON  
**API Documentation:** OpenAPI / Swagger  
**Testing:** JUnit, Mockito, Spring Boot Test, Repository Tests, Postman  
**DevOps:** Git, GitHub, GitHub Actions, Docker, CI/CD

---

## 1. Introduction

### 1.1 Purpose

BudgetBuddy is a personal finance management application that starts as a core expense tracker and evolves into a spending analytics and budgeting platform.

The project is developed incrementally:

```text
V1 → Core Expense Tracker
V2 → Better Expense Management
V3 → Analytics & Budget
```

Each version extends the previous version.

### 1.2 Product Vision

BudgetBuddy helps users:

- Record expenses
- View and manage expenses
- Search expenses
- Filter expenses
- Sort expenses
- Use pagination
- Understand spending patterns
- View spending analytics
- Create and manage budgets
- Track budget utilization

---

# 2. Scope

## 2.1 V1 — Core Expense Tracker

V1 includes:

- Expense CRUD
- Expense categories
- Category filtering
- Date filtering
- Total expense
- Expense count
- Dashboard
- Expense list
- Expense form
- REST APIs
- PostgreSQL
- Spring Data JPA
- DTOs
- Validation
- Exception handling
- OpenAPI / Swagger
- Automated tests
- CI/CD
- Deployment

## 2.2 V2 — Better Expense Management

V2 adds:

- Search
- Date-range filtering
- Amount-range filtering
- Category filtering
- Sorting
- Pagination
- Database indexes
- Query optimization
- Improved filtering and navigation

## 2.3 V3 — Analytics & Budget

V3 adds:

- Daily spending
- Weekly spending
- Monthly spending
- Category-wise spending
- Total spending
- Average spending
- Highest expense
- Lowest expense
- Budget CRUD
- Budget utilization
- Analytics dashboard
- Charts
- Category breakdown
- Monthly reports
- Budget progress

## 2.4 Out of Scope

The following are outside V1–V3:

- User registration
- Login
- Authentication
- JWT
- OAuth
- Multi-user support
- RBAC
- Password reset
- Email verification
- Mobile application
- Recurring transactions
- Notifications
- Redis
- Message queues
- AI
- RAG
- Vector database
- AI agents
- Advanced security/VAPT cycle

These belong to later roadmap versions unless separately approved.

---

# 3. Version Requirements

## 3.1 V1 — Core Expense Tracker

### 3.1.1 Expense CRUD

The system shall support:

1. Create expense
2. View all expenses
3. View expense by ID
4. Update expense
5. Delete expense

### 3.1.2 Expense Fields

| Field | Description |
|---|---|
| ID | Unique expense identifier |
| Title | Expense title |
| Amount | Expense amount |
| Category | Expense category |
| Expense Date | Date of expense |
| Description | Optional description |
| Created At | Creation timestamp |
| Updated At | Last modification timestamp |

### 3.1.3 Categories

Initial categories:

- Food
- Transport
- Shopping
- Bills
- Health
- Entertainment
- Other

### 3.1.4 V1 Filtering

The system shall support:

- Category filtering
- Date filtering

### 3.1.5 V1 Summary

The dashboard shall display:

- Total expense amount
- Number of expenses

---

# 4. V2 — Better Expense Management

## 4.1 Search

Users shall be able to search expenses using title and relevant expense information.

## 4.2 Filtering

The system shall support:

- Category
- Date range
- Minimum amount
- Maximum amount

## 4.3 Sorting

Expenses shall be sortable by:

- Date
- Amount
- Title

Both ascending and descending directions shall be supported.

## 4.4 Pagination

The API shall support:

- Page number
- Page size
- Total elements
- Total pages

## 4.5 Database Optimization

V2 shall introduce appropriate:

- Database indexes
- Query optimization
- Repository query optimization
- Schema improvements where required

---

# 5. V3 — Analytics & Budget

## 5.1 Spending Analytics

The system shall calculate:

- Daily spending
- Weekly spending
- Monthly spending
- Category-wise spending
- Total spending
- Average spending
- Highest expense
- Lowest expense

## 5.2 Budget Management

Users shall be able to:

- Create budget
- View budget
- Update budget
- Delete budget
- Track budget utilization

## 5.3 Budget Calculation

```text
Remaining = Budget Amount - Spent Amount

Utilization % =
(Spent Amount / Budget Amount) × 100
```

Example:

```text
Monthly Budget: ₹50,000
Spent:          ₹38,500
Remaining:      ₹11,500
Utilization:         77%
```

The UI shall communicate budget status using the supplied design system.

---

# 6. System Architecture

BudgetBuddy shall use a layered Spring Boot architecture.

```text
React Frontend
      │
      │ REST / JSON
      ↓
Spring Boot Controller
      │
      ↓
DTO
      │
      ↓
Mapper
      │
      ↓
Service
      │
      ↓
Repository
      │
      ↓
Spring Data JPA / Hibernate
      │
      ↓
PostgreSQL
```

## 6.1 Responsibilities

### Controller

- Receive HTTP requests
- Validate request DTOs
- Call services
- Return HTTP responses
- No business logic

### DTO

- Define API request/response contracts
- Prevent direct exposure of entities

### Mapper

- Convert request DTO → Entity
- Convert Entity → Response DTO

### Service

- Contain business logic
- Perform calculations
- Coordinate repositories

### Repository

- Handle database access
- Execute queries
- Support filtering, sorting and pagination

### Entity

- Represent persistent database data

### Exception Handler

- Handle exceptions consistently
- Return standard error responses

---

# 7. Standard Project Folder Structure

```text
budgetbuddy/
│
├── README.md
├── .gitignore
│
├── docs/
│   ├── PRODUCT_ROADMAP.md
│   └── SRS.md
│
├── backend/
│   │
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   │
│   └── src/
│       │
│       ├── main/
│       │   │
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── budgetbuddy/
│       │   │           └── backend/
│       │   │               │
│       │   │               ├── BudgetBuddyApplication.java
│       │   │               │
│       │   │               ├── config/
│       │   │               │   └── OpenApiConfig.java
│       │   │               │
│       │   │               ├── controller/
│       │   │               │   ├── ExpenseController.java
│       │   │               │   ├── AnalyticsController.java
│       │   │               │   └── BudgetController.java
│       │   │               │
│       │   │               ├── dto/
│       │   │               │   ├── request/
│       │   │               │   │   ├── CreateExpenseRequest.java
│       │   │               │   │   ├── UpdateExpenseRequest.java
│       │   │               │   │   ├── ExpenseFilterRequest.java
│       │   │               │   │   ├── CreateBudgetRequest.java
│       │   │               │   │   └── UpdateBudgetRequest.java
│       │   │               │   │
│       │   │               │   └── response/
│       │   │               │       ├── ExpenseResponse.java
│       │   │               │       ├── ExpensePageResponse.java
│       │   │               │       ├── ExpenseSummaryResponse.java
│       │   │               │       ├── AnalyticsResponse.java
│       │   │               │       ├── CategorySpendingResponse.java
│       │   │               │       ├── MonthlySpendingResponse.java
│       │   │               │       ├── BudgetResponse.java
│       │   │               │       └── BudgetSummaryResponse.java
│       │   │               │
│       │   │               ├── entity/
│       │   │               │   ├── Expense.java
│       │   │               │   └── Budget.java
│       │   │               │
│       │   │               ├── enums/
│       │   │               │   ├── ExpenseCategory.java
│       │   │               │   └── BudgetPeriod.java
│       │   │               │
│       │   │               ├── exception/
│       │   │               │   ├── GlobalExceptionHandler.java
│       │   │               │   ├── ResourceNotFoundException.java
│       │   │               │   ├── InvalidRequestException.java
│       │   │               │   └── ErrorResponse.java
│       │   │               │
│       │   │               ├── mapper/
│       │   │               │   ├── ExpenseMapper.java
│       │   │               │   └── BudgetMapper.java
│       │   │               │
│       │   │               ├── repository/
│       │   │               │   ├── ExpenseRepository.java
│       │   │               │   └── BudgetRepository.java
│       │   │               │
│       │   │               ├── service/
│       │   │               │   ├── ExpenseService.java
│       │   │               │   ├── BudgetService.java
│       │   │               │   └── AnalyticsService.java
│       │   │               │
│       │   │               └── specification/
│       │   │                   └── ExpenseSpecification.java
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│           │
│           └── java/
│               └── com/
│                   └── budgetbuddy/
│                       └── backend/
│                           ├── controller/
│                           │   ├── ExpenseControllerTest.java
│                           │   ├── AnalyticsControllerTest.java
│                           │   └── BudgetControllerTest.java
│                           │
│                           ├── service/
│                           │   ├── ExpenseServiceTest.java
│                           │   ├── AnalyticsServiceTest.java
│                           │   └── BudgetServiceTest.java
│                           │
│                           └── repository/
│                               ├── ExpenseRepositoryTest.java
│                               └── BudgetRepositoryTest.java
│
├── frontend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   │
│   └── src/
│       │
│       ├── assets/
│       │   └── images/
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Loader.jsx
│       │   │   ├── ErrorMessage.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Select.jsx
│       │   │   ├── Toast.jsx
│       │   │   ├── EmptyState.jsx
│       │   │   └── LoadingState.jsx
│       │   │
│       │   ├── expense/
│       │   │   ├── ExpenseForm.jsx
│       │   │   ├── ExpenseTable.jsx
│       │   │   ├── ExpenseCard.jsx
│       │   │   ├── ExpenseFilters.jsx
│       │   │   ├── ExpenseSearch.jsx
│       │   │   ├── ExpenseSort.jsx
│       │   │   └── ExpensePagination.jsx
│       │   │
│       │   ├── analytics/
│       │   │   ├── SpendingSummary.jsx
│       │   │   ├── SpendingTrendChart.jsx
│       │   │   ├── CategoryBreakdown.jsx
│       │   │   ├── MonthlyReport.jsx
│       │   │   └── ExpenseStatistics.jsx
│       │   │
│       │   └── budget/
│       │       ├── BudgetForm.jsx
│       │       ├── BudgetCard.jsx
│       │       ├── BudgetProgress.jsx
│       │       └── BudgetList.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Expenses.jsx
│       │   ├── Analytics.jsx
│       │   ├── Budgets.jsx
│       │   └── NotFound.jsx
│       │
│       ├── layouts/
│       │   └── MainLayout.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── expenseService.js
│       │   ├── analyticsService.js
│       │   └── budgetService.js
│       │
│       ├── hooks/
│       │   ├── useExpenses.js
│       │   ├── useAnalytics.js
│       │   └── useBudgets.js
│       │
│       ├── context/
│       │   └── AppContext.jsx
│       │
│       ├── utils/
│       │   ├── formatCurrency.js
│       │   ├── formatDate.js
│       │   └── calculatePercentage.js
│       │
│       ├── constants/
│       │   ├── expenseConstants.js
│       │   ├── budgetConstants.js
│       │   └── apiConstants.js
│       │
│       ├── styles/
│       │   ├── index.css
│       │   ├── variables.css
│       │   └── components.css
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── database/
│   ├── README.md
│   └── migrations/
│       ├── V1__initial_schema.sql
│       ├── V2__expense_indexes.sql
│       └── V3__budget_schema.sql
│
├── postman/
│   ├── BudgetBuddy.postman_collection.json
│   └── BudgetBuddy.postman_environment.json
│
└── .github/
    └── workflows/
        └── ci.yml
```

---

# 8. Backend Detailed Requirements

## 8.1 Expense Entity

Logical fields:

```text
Expense
├── id
├── title
├── amount
├── category
├── expenseDate
├── description
├── createdAt
└── updatedAt
```

The entity shall use JPA annotations for persistence.

## 8.2 Budget Entity

Logical fields:

```text
Budget
├── id
├── name
├── amount
├── period
├── startDate
├── endDate
├── createdAt
└── updatedAt
```

Budget functionality is introduced in V3.

---

# 9. DTO Requirements

## Request DTOs

```text
CreateExpenseRequest
UpdateExpenseRequest
ExpenseFilterRequest
CreateBudgetRequest
UpdateBudgetRequest
```

## Response DTOs

```text
ExpenseResponse
ExpensePageResponse
ExpenseSummaryResponse
AnalyticsResponse
CategorySpendingResponse
MonthlySpendingResponse
BudgetResponse
BudgetSummaryResponse
```

DTOs shall be used instead of exposing JPA entities directly through REST APIs.

---

# 10. Validation Requirements

Examples:

### Expense Title

- Required
- Must not be blank

### Amount

- Required
- Must be greater than zero

### Category

- Required
- Must be a supported category

### Expense Date

- Required

### Budget Amount

- Required
- Must be greater than zero

Invalid input shall return a suitable 4xx response.

---

# 11. Exception Handling

A global exception handler shall provide consistent error responses.

Example:

```json
{
  "timestamp": "2026-08-21T10:30:00",
  "status": 404,
  "error": "RESOURCE_NOT_FOUND",
  "message": "Expense not found",
  "path": "/api/v1/expenses/10"
}
```

The API must not expose stack traces, credentials, secrets or internal implementation details.

---

# 12. REST API Specification

Base URL:

```text
/api/v1
```

## 12.1 Expense APIs

### Create

```http
POST /api/v1/expenses
```

### Get All

```http
GET /api/v1/expenses
```

### Get By ID

```http
GET /api/v1/expenses/{id}
```

### Update

```http
PUT /api/v1/expenses/{id}
```

### Delete

```http
DELETE /api/v1/expenses/{id}
```

## 12.2 V2 Search and Filters

```http
GET /api/v1/expenses?search=dinner
```

```http
GET /api/v1/expenses?category=FOOD
```

```http
GET /api/v1/expenses?fromDate=2026-08-01&toDate=2026-08-21
```

```http
GET /api/v1/expenses?minAmount=100&maxAmount=1000
```

## 12.3 Sorting

```http
GET /api/v1/expenses?sortBy=amount&direction=desc
```

Supported fields:

- date
- amount
- title

## 12.4 Pagination

```http
GET /api/v1/expenses?page=0&size=10
```

Example response:

```json
{
  "content": [],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5
}
```

---

# 13. Analytics APIs

## Summary

```http
GET /api/v1/analytics/summary
```

## Daily

```http
GET /api/v1/analytics/daily
```

## Weekly

```http
GET /api/v1/analytics/weekly
```

## Monthly

```http
GET /api/v1/analytics/monthly
```

## Category

```http
GET /api/v1/analytics/category
```

---

# 14. Budget APIs

## Create

```http
POST /api/v1/budgets
```

## Get All

```http
GET /api/v1/budgets
```

## Get By ID

```http
GET /api/v1/budgets/{id}
```

## Update

```http
PUT /api/v1/budgets/{id}
```

## Delete

```http
DELETE /api/v1/budgets/{id}
```

## Utilization

```http
GET /api/v1/budgets/{id}/utilization
```

---

# 15. HTTP Status Codes

| Situation | Status |
|---|---:|
| Successful GET | 200 |
| Successful POST | 201 |
| Successful PUT | 200 |
| Successful DELETE | 204 |
| Invalid request | 400 |
| Resource not found | 404 |
| Conflict | 409 |
| Server error | 500 |

---

# 16. Database Requirements

## 16.1 PostgreSQL via Supabase

PostgreSQL shall be used as the relational database. Production PostgreSQL shall be hosted by Supabase.

## 16.2 V1 Tables

```text
expenses
```

## 16.3 V3 Tables

```text
expenses
budgets
```

## 16.4 Expenses Table

```text
expenses
────────────────────────────────
id                BIGINT PK
title             VARCHAR
amount            NUMERIC
category          VARCHAR
expense_date      DATE
description       TEXT
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

## 16.5 Budgets Table

```text
budgets
────────────────────────────────
id                BIGINT PK
name              VARCHAR
amount            NUMERIC
period            VARCHAR
start_date        DATE
end_date          DATE
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

---

# 17. Database Migrations

```text
database/migrations/
├── V1__initial_schema.sql
├── V2__expense_indexes.sql
└── V3__budget_schema.sql
```

Migrations must be:

- Version controlled
- Reproducible
- Reviewable
- Deployment-safe

---

# 18. V2 Indexing

Indexes shall be introduced according to actual query requirements.

Potential fields include:

```text
expense_date
category
amount
title
```

Composite indexes may be used when justified by query patterns.

---

# 19. Frontend Requirements

## V1 Pages

```text
Dashboard.jsx
Expenses.jsx
NotFound.jsx
```

## V3 Pages

```text
Analytics.jsx
Budgets.jsx
```

## Expense Components

```text
ExpenseForm
ExpenseTable
ExpenseCard
ExpenseFilters
ExpenseSearch
ExpenseSort
ExpensePagination
```

## Analytics Components

```text
SpendingSummary
SpendingTrendChart
CategoryBreakdown
MonthlyReport
ExpenseStatistics
```

## Budget Components

```text
BudgetForm
BudgetCard
BudgetProgress
BudgetList
```

---

# 20. Frontend Service Layer

```text
expenseService.js
analyticsService.js
budgetService.js
```

Services shall handle communication with the backend.

Components should not contain repeated API-call logic.

---

# 21. Frontend Hooks

```text
useExpenses.js
useAnalytics.js
useBudgets.js
```

Hooks shall manage feature-specific data fetching and state where appropriate.

---

# 22. Design System Requirements

A friendly-but-premium personal budgeting app. Token-driven, responsive, light + dark, no inline styles, no hardcoded business data, no duplicated components.

---

## 1. Principles

1. **Tokens first** — every color, radius, shadow, spacing and font comes from a token in `src/styles.css`. Components never hardcode values.
2. **One component, many variants** — a single `Button`, `Card`, `Input`, etc. Variation happens through variants, never through copies.
3. **Calm motion** — 200–500ms, eased with `cubic-bezier(0.22, 1, 0.36, 1)`, only used to explain change.
4. **Data is external** — every figure comes from API/service data; components receive data through props/state. The implementation uses the project's React + Vite JavaScript structure.
5. **Encouraging tone** — copy is plain and supportive ("Hey Srush, nice work"), never bank jargon.

---

## 2. Color tokens

Semantic names, defined in oklch for both themes.

| Token | Purpose | Light | Dark |
| --- | --- | --- | --- |
| `background` | App canvas | `oklch(0.985 0.005 240)` | `oklch(0.18 0.025 255)` |
| `foreground` | Primary text | `oklch(0.21 0.03 255)` | `oklch(0.96 0.008 240)` |
| `card` | Surfaces | `oklch(1 0 0)` | `oklch(0.225 0.028 257)` |
| `primary` | Brand / key actions | `oklch(0.55 0.13 190)` | `oklch(0.72 0.13 185)` |
| `accent` | Soft brand tint | `oklch(0.94 0.035 190)` | `oklch(0.32 0.05 195)` |
| `muted` / `muted-foreground` | Secondary surfaces + text | `oklch(0.96 0.008 240)` / `oklch(0.53 0.02 250)` | `oklch(0.27 0.028 257)` / `oklch(0.7 0.02 250)` |
| `success` | Under budget / income | `oklch(0.63 0.14 155)` | `oklch(0.72 0.14 158)` |
| `warning` | Close to limit / pending | `oklch(0.76 0.14 75)` | `oklch(0.8 0.14 78)` |
| `destructive` | Over budget / declined | `oklch(0.58 0.2 22)` | `oklch(0.65 0.19 22)` |
| `border` / `input` / `ring` | Edges + focus | `oklch(0.915 0.01 245)` | `oklch(1 0 0 / 10–14%)` |
| `chart-1…5` | Data visualisation | teal, green, blue, amber, magenta | brightened equivalents |
| `sidebar-*` | Navigation surface set | — | — |

Gradients: `--gradient-brand` (teal → green), `--gradient-surface` (subtle tinted card wash).

**Contrast rule:** `warning-foreground` is only for text *on* a solid `warning` fill. For amber text on a card, use `text-warning` so it stays readable in dark mode.

---

## 3. Typography

| Role | Utility | Family | Size / weight |
| --- | --- | --- | --- |
| Display XL | `display-xl` | Sora | 2.5rem / 700, tracking -0.03em |
| Display LG | `display-lg` | Sora | 1.75rem / 600 |
| Heading MD | `heading-md` | Sora | 1.125rem / 600 |
| Body | default | Manrope | 1rem / 400 |
| Body SM | `body-sm` | Manrope | 0.875rem / 400 |
| Label XS | `label-xs` | Manrope | 0.6875rem / 600, uppercase, tracking 0.09em |
| Numeric | `numeric` | JetBrains Mono | tabular figures for every money value |

Fonts load through the Vite application's `index.html` or the approved font-loading mechanism (never `@import` in CSS).

---

## 4. Spacing, radius, shadows, motion

- **Spacing**: Tailwind 4px base; component padding `4 / 6`, section rhythm `space-y-8`.
- **Radius**: base `--radius: 0.875rem` → `sm, md, lg, xl, 2xl, 3xl`. Buttons `lg`, cards `xl`, pills `full`.
- **Shadows**: `--shadow-soft` (controls), `--shadow-card` (surfaces), `--shadow-lifted` (overlays), `--shadow-glow` (premium actions).
- **Motion**: `--ease-smooth`, `--animate-rise` (content entry, staggered 60ms), `--animate-fade` (state swaps), 2–4px hover lift on premium surfaces only.

---

## 5. Components

| Component | Variants / states |
| --- | --- |
| **Button** | `premium` (gradient + glow), `default`, `secondary`, `soft`, `outline`, `ghost`, `destructive`, `link`; sizes `sm / default / lg / icon`; disabled + focus ring |
| **Card** | Gradient-wash surface, header (title + description), content, optional action slot |
| **Input** | Text, numeric (mono, tabular), leading-icon search, label + focus ring |
| **Select** | Trigger + popover list, keyboard navigable (date range, category, account) |
| **Modal** | Add-expense dialog: header, form body, cancel + confirm footer |
| **Table** | Header row, hover highlight, status badges, right-aligned amount, horizontal scroll on mobile |
| **Progress** | Budget bars: success under 85%, warning 85–100%, destructive over limit |
| **Navbar** | Sticky, translucent + blur, search, notifications, theme toggle, avatar |
| **Sidebar** | Fixed on desktop, sheet drawer on mobile; active item, badge counts, upgrade card |
| **Toast** | Sonner, success + default, title + description |
| **Empty state** | Icon medallion, title, supporting copy, one soft action |
| **Loading state** | Skeletons matching final layout, `aria-busy` |
| **Error state** | Destructive-tinted panel, cause copy, retry action, `role="alert"` |

---

## 6. App structure (Overview screen)

1. **Greeting header** — name, encouraging status line, date-range select, Export, Add expense.
2. **Metric row** — Total spent, Expense count, Average spending, and budget status (budget status is available in V3).
3. **Money flow** — income vs spending area chart (Months / Weeks tabs).
4. **Category budgets** — progress bars per category with spent / limit figures.
5. **Recent activity** — expense table with category/date/amount information.
6. **Budget progress** — introduced in V3.
7. **Quick actions** — add expense, set budget, view analytics, monthly report.

Navigation: Overview, Budgets, Expenses, Analytics.

---

## 7. Layout

- Desktop: 256px fixed sidebar + fluid content, max width 1280px, 4-column metrics, 2:1 chart/budget split.
- Tablet: sidebar becomes drawer, metrics 2-up, chart full width.
- Mobile: single column, table scrolls horizontally, secondary columns hidden.
- Header is 64px, sticky at all breakpoints.

---

## 8. Theming

Light and dark share token names; only values change. Theme is a `.dark` class on `<html>`, persisted under `budgetbuddy-theme`, defaulting to system preference, toggled from the navbar. Both themes verified against the live dashboard.

---

## 9. Rules

- No inline styles (only exception: the animation-delay stagger variable).
- No hardcoded color utilities such as `text-white` or `bg-[#hex]`.
- No business data inside components — all figures live in the data module.
- No duplicated components — extend variants instead of forking files.
- Every interactive element keeps a visible focus ring and an accessible name.

# 23. Security Requirements

Even though authentication is outside V1–V3, secure development practices are required.

- Use environment variables.
- Never commit `.env`.
- Never expose secrets.
- Validate all input.
- Use JPA/parameterized queries.
- Do not expose stack traces.
- Do not expose database credentials.
- Apply suitable CORS configuration.
- Keep dependencies updated.
- Use secure application configuration.

---

# 24. Environment Configuration

Example variables:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
SERVER_PORT
```

`.env.example` shall contain placeholders only.

Actual `.env` files shall not be committed.

---

# 25. Testing Strategy

## 25.1 Controller Tests

Test:

- HTTP status
- Request validation
- Response structure
- API behavior

## 25.2 Service Tests

Test:

- Business logic
- Calculations
- Successful operations
- Invalid conditions
- Not-found conditions

## 25.3 Repository Tests

Test:

- Persistence
- Queries
- Filtering
- Sorting
- Pagination
- Analytics queries

---

# 26. V1 Test Requirements

At minimum:

```text
Create Expense
Get Expense
Get All Expenses
Update Expense
Delete Expense
Category Filter
Date Filter
Validation
Not Found
Exception Handling
```

# 27. V2 Test Requirements

Additional tests:

```text
Search
Date Range
Amount Range
Sorting
Pagination
Combined Filters
```

# 28. V3 Test Requirements

Additional tests:

```text
Daily Analytics
Weekly Analytics
Monthly Analytics
Category Analytics
Average Spending
Highest Expense
Lowest Expense
Budget CRUD
Budget Utilization
Remaining Budget
Over-budget condition
```

---

# 29. API Documentation

OpenAPI/Swagger shall document:

- Endpoints
- HTTP methods
- Parameters
- Request DTOs
- Response DTOs
- Validation
- Status codes
- Error responses

Configuration:

```text
config/OpenApiConfig.java
```

---

# 30. Postman

The Postman collection shall contain V1–V3 APIs.

```text
BudgetBuddy
├── Expenses
│   ├── Create
│   ├── Get All
│   ├── Get By ID
│   ├── Update
│   └── Delete
│
├── Expense Search & Filters
│   ├── Search
│   ├── Filter
│   ├── Sort
│   └── Pagination
│
├── Analytics
│   ├── Summary
│   ├── Daily
│   ├── Weekly
│   ├── Monthly
│   └── Category
│
└── Budgets
    ├── Create
    ├── Get All
    ├── Get By ID
    ├── Update
    ├── Delete
    └── Utilization
```

---

# 31. Git and GitHub Requirements

The project shall use:

- Feature branches
- Meaningful commits
- Pull requests
- Code reviews
- Protected main/release branches
- Release tags

Example:

```text
main
├── feature/expense-crud
├── feature/expense-search
├── feature/expense-pagination
├── feature/analytics
└── feature/budget-management
```

Direct pushes to main are not allowed.

---

# 32. CI/CD

GitHub Actions shall run appropriate checks.

```text
Push / Pull Request
        ↓
Build
        ↓
Tests
        ↓
Quality Checks
        ↓
Package
        ↓
Deploy
        ↓
Production Verification
```

A release shall not be considered complete until the required checks pass.

---

# 33. Docker

Dockerfiles:

```text
backend/Dockerfile
frontend/Dockerfile
```

Docker configuration shall not contain hardcoded secrets.

---


# 34. Production Deployment — Vercel + Render + Supabase

## 34.1 Deployment Architecture

```text
User Browser
    │
    ▼
Vercel
React + Vite Frontend
    │
    │ HTTPS / REST / JSON
    ▼
Render
Spring Boot + JPA Backend
    │
    │ JDBC / PostgreSQL
    ▼
Supabase
Managed PostgreSQL
```

Responsibilities:

| Platform | Responsibility |
|---|---|
| Vercel | React/Vite frontend hosting and production delivery |
| Render | Spring Boot backend hosting |
| Supabase | Managed PostgreSQL database |
| GitHub | Source control |
| GitHub Actions | Build/test CI |

The frontend must never connect directly to PostgreSQL. All application database access must go through the Spring Boot backend.

## 34.2 Vercel Requirements

- Deploy the `frontend` application as a React + Vite project.
- Configure the production API base URL using a Vite environment variable.
- Example:

```text
VITE_API_BASE_URL=https://<render-service-domain>/api/v1
```

- Only non-secret values may be exposed through `VITE_*` variables.
- Configure SPA fallback/routing as required by the selected frontend routing approach.
- Verify the production build before release.
- Use HTTPS.

## 34.3 Render Requirements

- Deploy the `backend` Spring Boot application.
- Configure the Java/JDK version used by the project.
- Configure the Maven build/start process.
- Configure production environment variables in Render.
- Configure CORS to allow the deployed Vercel origin.
- Use the Render-provided application port through the Spring Boot `server.port` configuration.
- Do not commit production secrets.
- The backend must be able to reach Supabase PostgreSQL from Render.
- A health endpoint such as `/actuator/health` is recommended when Spring Boot Actuator is enabled.

## 34.4 Supabase Requirements

- Supabase provides the production PostgreSQL database.
- The backend connects to Supabase using PostgreSQL/JDBC credentials stored only on the backend.
- Use the appropriate Supabase connection method for the deployment environment.
- Connection pooling should be used when appropriate for the deployed workload.
- Database credentials must never be placed in React/Vercel environment variables.
- Database migrations remain version-controlled in the repository.

## 34.5 Production Environment Variables

### Backend — Render

Typical configuration:

```text
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
CORS_ALLOWED_ORIGINS
```

The exact JDBC URL and credential values must be taken from the Supabase project configuration.

### Frontend — Vercel

```text
VITE_API_BASE_URL=https://<render-service-domain>/api/v1
```

No database password, service-role key, or other backend secret may be exposed through Vercel.

## 34.6 Production CORS

The Spring Boot backend shall allow requests from the deployed Vercel frontend origin.

Development origins may be allowed only in development configuration.

Production CORS must not use an unrestricted wildcard when credentials or protected resources are introduced later.

## 34.7 Deployment Flow

```text
Developer
   │
   ▼
GitHub
   │
   ├──► GitHub Actions
   │      ├── Backend build
   │      ├── Backend tests
   │      └── Frontend build
   │
   ├──► Vercel
   │      └── Frontend deployment
   │
   └──► Render
          └── Backend deployment
                 │
                 ▼
          Supabase PostgreSQL
```

## 34.8 Production Smoke Tests

After deployment verify:

```text
[ ] Vercel frontend opens
[ ] Frontend can reach Render API
[ ] Render backend starts successfully
[ ] Backend connects to Supabase
[ ] Create expense works
[ ] Read expense works
[ ] Update expense works
[ ] Delete expense works
[ ] Filters work
[ ] Pagination works
[ ] Analytics work in V3
[ ] Budget operations work in V3
[ ] No secrets appear in browser/network responses
```

# 35. Non-Functional Requirements

## 34.1 Performance

The application should:

- Use efficient database queries
- Use pagination for large datasets
- Avoid unnecessary API calls
- Use suitable database indexes
- Avoid unnecessary frontend rendering
- Keep API responses efficient

## 34.2 Scalability

The layered architecture should allow future modules without rewriting existing features.

## 34.3 Maintainability

The codebase shall:

- Follow clear package separation
- Use meaningful names
- Avoid duplication
- Use reusable components
- Keep business logic in services
- Keep database logic in repositories
- Keep API contracts in DTOs

## 34.4 Reliability

The application shall:

- Validate input
- Handle missing resources
- Handle database errors
- Return meaningful errors
- Maintain database integrity

## 34.5 Usability

The application shall provide:

- Simple navigation
- Clear financial information
- Responsive design
- Consistent UI
- Clear forms
- Useful error messages
- Loading states
- Empty states
- Search
- Filtering
- Understandable charts

---

# 36. Release Criteria

## V1

V1 is complete when:

- Expense CRUD works
- Category filtering works
- Date filtering works
- Summary works
- PostgreSQL integration works
- Backend tests pass
- Frontend works
- API documentation is available
- Postman collection works
- CI passes
- Deployment succeeds
- Production smoke tests pass

## V2

V2 is complete when V1 remains functional and:

- Search works
- Advanced filters work
- Sorting works
- Pagination works
- Indexes are implemented
- Query performance is acceptable
- Frontend controls work
- Automated tests pass
- CI passes
- Deployment succeeds

## V3

V3 is complete when V1 and V2 remain functional and:

- Analytics work
- Charts work
- Category analysis works
- Monthly reports work
- Budget CRUD works
- Budget utilization works
- Budget progress works
- Tests pass
- CI passes
- Deployment succeeds
- Production verification passes

---

# 37. Version Evolution

```text
V1
Core Expense Tracker
│
├── CRUD
├── Categories
├── Basic Filters
└── Basic Summary
        │
        ↓
V2
Better Expense Management
│
├── Search
├── Advanced Filters
├── Sorting
├── Pagination
└── Query Optimization
        │
        ↓
V3
Analytics & Budget
│
├── Analytics
├── Charts
├── Reports
├── Budgets
└── Budget Utilization
```

---

# 38. Final Technology Stack

```text
Frontend
├── React
├── Vite
├── JavaScript
└── CSS / Design Tokens

Backend
├── Java
├── Spring Boot
├── Spring Data JPA
├── Hibernate
└── Maven

Database
└── Supabase PostgreSQL

API
├── REST
├── JSON
└── OpenAPI / Swagger

Testing
├── JUnit
├── Mockito
├── Spring Boot Test
├── Repository Tests
└── Postman

Deployment
├── Vercel
├── Render
└── Supabase

DevOps
├── Git
├── GitHub
├── GitHub Actions
├── Docker
└── CI/CD
```

---

# 39. Development Rules

1. Do not change the approved architecture without approval.
2. Follow the repository structure.
3. Never request or expose secrets.
4. Use environment variables.
5. Never commit `.env`.
6. Follow the API specification.
7. Follow the UI design system.
8. Do not use inline styles.
9. Do not hardcode business data.
10. Write tests for new functionality.
11. Do not modify unrelated files.
12. Do not push directly to main.
13. Run required checks before completion.
14. Update documentation when architecture changes.
15. Ask for approval when requirements are ambiguous.

---

# 40. Final Product Definition

BudgetBuddy V1–V3 shall evolve as:

```text
V1
Expense Tracker
    ↓
V2
Efficient Expense Management
    ↓
V3
Personal Spending Analytics + Budgeting
```

The final V3 product shall provide a complete personal expense tracking, spending analytics and budgeting experience while maintaining a clean Spring Boot + JPA, React and PostgreSQL architecture.

---

## End of SRS
