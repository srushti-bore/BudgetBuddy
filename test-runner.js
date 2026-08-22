// test-runner.js - Automated Postman-equivalent test runner for BudgetBuddy
const http = require('http');

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:5173';

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json, rawText: data });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 RUNNING BUDGETBUDDY FULL POSTMAN TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(` ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.log(` ❌ FAIL: ${name}`);
      console.log(`    Error: ${err.message}`);
      failed++;
    }
  }

  let createdExpenseId = null;
  let createdBudgetId = null;

  console.log('--- 🌐 1. FRONTEND LAYER TESTS ---');
  await test('Frontend UI serves HTML correctly (GET /)', async () => {
    const res = await request(FRONTEND_URL);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!res.rawText.includes('BudgetBuddy')) throw new Error('HTML title/content missing BudgetBuddy');
  });

  await test('Frontend Vite Proxy forwards to Backend API (GET /api/v1/analytics/summary)', async () => {
    const res = await request(`${FRONTEND_URL}/api/v1/analytics/summary`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (typeof res.data.totalSpending !== 'number') throw new Error('Proxy failed to return JSON analytics payload');
  });

  console.log('\n--- 📚 2. SWAGGER & SYSTEM DOCUMENTATION TESTS ---');
  await test('OpenAPI Spec endpoint returns valid schema (GET /v3/api-docs)', async () => {
    const res = await request(`${BACKEND_URL}/v3/api-docs`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!res.data.openapi) throw new Error('Not a valid OpenAPI JSON spec');
  });

  await test('Swagger UI Interface is reachable (GET /swagger-ui/index.html)', async () => {
    const res = await request(`${BACKEND_URL}/swagger-ui/index.html`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!res.rawText.includes('swagger-ui')) throw new Error('Swagger UI page did not load');
  });

  console.log('\n--- 💾 3. EXPENSE & POSTGRESQL DATABASE PERSISTENCE TESTS ---');
  await test('DB Insert: Create new expense (POST /api/v1/expenses)', async () => {
    const payload = {
      title: "Postman Automated Test Purchase",
      amount: 1499.00,
      category: "SHOPPING",
      expenseDate: "2026-08-22",
      description: "Created via Postman test runner"
    };
    const res = await request(`${BACKEND_URL}/api/v1/expenses`, { method: 'POST' }, payload);
    if (res.status !== 201) throw new Error(`Expected status 201 Created, got ${res.status}`);
    if (!res.data.id) throw new Error('No DB ID generated');
    createdExpenseId = res.data.id;
  });

  await test('DB Query: Read created expense by ID (GET /api/v1/expenses/:id)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/expenses/${createdExpenseId}`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (res.data.title !== "Postman Automated Test Purchase") throw new Error('Title does not match DB record');
  });

  await test('DB Update: Update expense (PUT /api/v1/expenses/:id)', async () => {
    const payload = {
      title: "Updated Postman Purchase",
      amount: 1899.50,
      category: "SHOPPING",
      expenseDate: "2026-08-22",
      description: "Updated during Postman test run"
    };
    const res = await request(`${BACKEND_URL}/api/v1/expenses/${createdExpenseId}`, { method: 'PUT' }, payload);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (res.data.amount !== 1899.50) throw new Error('Amount was not updated in DB');
  });

  await test('DB Filter & Pagination: Filter query (GET /api/v1/expenses?category=SHOPPING)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/expenses?category=SHOPPING&page=0&size=10`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data.content)) throw new Error('Content is not an array');
    if (res.data.totalElements < 1) throw new Error('Filter did not return any records');
  });

  await test('DB Delete: Remove expense (DELETE /api/v1/expenses/:id)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/expenses/${createdExpenseId}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error(`Expected status 204 No Content, got ${res.status}`);
  });

  await test('DB Verify Deletion: Confirm record returns 404 (GET /api/v1/expenses/:id)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/expenses/${createdExpenseId}`);
    if (res.status !== 404) throw new Error(`Expected status 404 Not Found, got ${res.status}`);
  });

  console.log('\n--- 📊 4. BUDGET & UTILIZATION DATABASE TESTS ---');
  await test('DB Insert: Create new budget (POST /api/v1/budgets)', async () => {
    const payload = {
      name: "Test Postman Budget",
      amount: 15000.00,
      period: "MONTHLY",
      startDate: "2026-08-01",
      endDate: "2026-08-31"
    };
    const res = await request(`${BACKEND_URL}/api/v1/budgets`, { method: 'POST' }, payload);
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    createdBudgetId = res.data.id;
  });

  await test('DB Query: Get all budgets (GET /api/v1/budgets)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/budgets`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data) || res.data.length === 0) throw new Error('Budgets array is empty');
  });

  await test('DB Calculation: Check budget utilization (GET /api/v1/budgets/:id/utilization)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/budgets/${createdBudgetId}/utilization`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (typeof res.data.spentAmount === 'undefined' || typeof res.data.remainingAmount === 'undefined') {
      throw new Error('Utilization calculation missing spentAmount or remainingAmount');
    }
  });

  await test('DB Cleanup: Delete test budget (DELETE /api/v1/budgets/:id)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/budgets/${createdBudgetId}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error(`Expected status 204, got ${res.status}`);
  });

  console.log('\n--- 📈 5. ANALYTICS & AGGREGATIONS TESTS ---');
  await test('Analytics: Get financial summary KPIs (GET /api/v1/analytics/summary)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/analytics/summary`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (typeof res.data.dailySpending !== 'number' || typeof res.data.totalSpending !== 'number') {
      throw new Error('Analytics summary missing key metrics');
    }
  });

  await test('Analytics: Category spending breakdown (GET /api/v1/analytics/category)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/analytics/category`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Category breakdown is not an array');
  });

  await test('Analytics: Monthly spending trend reports (GET /api/v1/analytics/monthly)', async () => {
    const res = await request(`${BACKEND_URL}/api/v1/analytics/monthly`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Monthly trends is not an array');
  });

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
