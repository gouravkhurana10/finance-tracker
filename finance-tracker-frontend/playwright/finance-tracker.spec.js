import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const TEST_USER = {
    name: 'Test User',
    email: 'testuser@gmail.com',
    password: 'password123'
};

test.describe('Authentication Tests', () => {
    test.setTimeout(60000);

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // Try register first
        await page.goto(`${BASE_URL}/register`);
        await page.fill('input[name="name"]', TEST_USER.name);
        await page.fill('input[name="email"]', TEST_USER.email);
        await page.fill('input[name="password"]', TEST_USER.password);
        await page.fill('input[name="confirmPassword"]', TEST_USER.password);
        await page.click('button[type="submit"]');

        // Wait 3 seconds for any response
        await page.waitForTimeout(3000);

        // Checking if we are on dashboard already
        if (!page.url().includes('/dashboard')) {
            // If email already exists — login instead
            await page.goto(`${BASE_URL}/login`);
            await page.waitForTimeout(1000);
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForTimeout(3000);
        }

        await context.close();
    });

    test('EP01 - Register with valid credentials', async ({ page }) => {
        await page.goto(`${BASE_URL}/register`);
        await page.fill('input[name="name"]', 'New User');
        await page.fill('input[name="email"]', `newuser${Date.now()}@gmail.com`);
        await page.fill('input[name="password"]', TEST_USER.password);
        await page.fill('input[name="confirmPassword"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    });

    test('EP02 - Register with mismatched passwords shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/register`);
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', `another${Date.now()}@gmail.com`);
        await page.fill('input[name="password"]', 'password123');
        await page.fill('input[name="confirmPassword"]', 'differentpassword');
        await page.click('button[type="submit"]');
        await expect(page.locator('.alert-danger')).toBeVisible();
        await expect(page.locator('.alert-danger'))
            .toContainText('Passwords do not match');
    });

    test('EP03 - Register with short password shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/register`);
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', `short${Date.now()}@gmail.com`);
        await page.fill('input[name="password"]', '123');
        await page.fill('input[name="confirmPassword"]', '123');
        await page.click('button[type="submit"]');
        await expect(page.locator('.alert-danger')).toBeVisible();
        await expect(page.locator('.alert-danger'))
            .toContainText('Password must be at least 6 characters');
    });

    test('EP04 - Login with valid credentials redirects to dashboard',
        async ({ page }) => {
            await page.goto(`${BASE_URL}/login`);
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
        });

    test('EP05 - Login with invalid credentials shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', 'wrong@gmail.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        await expect(page.locator('.alert-danger')).toBeVisible();
    });

    test('EP06 - Protected route redirects to login when not authenticated',
        async ({ page }) => {
            await page.goto(`${BASE_URL}/dashboard`);
            await expect(page).toHaveURL(`${BASE_URL}/login`);
        });

});

test.describe('Transaction Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', TEST_USER.email);
        await page.fill('input[name="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    });

    test('SW01 - Dashboard displays balance income and expenses',
        async ({ page }) => {
            await expect(page.locator('text=Total Balance')).toBeVisible();
            await expect(page.locator('text=Total Income')).toBeVisible();
            await expect(page.locator('text=Total Expenses')).toBeVisible();
        });

    test('SW02 - Navigate to transactions page', async ({ page }) => {
        await page.click('text=Transactions');
        await expect(page).toHaveURL(`${BASE_URL}/transactions`);
        await expect(page.locator('text=💳 Transactions')).toBeVisible();
    });

    test('SW03 - Add new income transaction', async ({ page }) => {
        await page.goto(`${BASE_URL}/transactions`);
        await page.click('text=+ Add Transaction');
        await page.fill('input[name="title"]', 'E2E Test Salary');
        await page.fill('input[name="amount"]', '3000');
        await page.selectOption('select[name="type"]', 'INCOME');
        await page.selectOption('select[name="category"]', 'Salary');
        await page.click('text=Save Transaction');
        await expect(page.locator('text=E2E Test Salary').first())
            .toBeVisible();
    });

    test('SW04 - Add new expense transaction', async ({ page }) => {
        await page.goto(`${BASE_URL}/transactions`);
        await page.click('text=+ Add Transaction');
        await page.fill('input[name="title"]', 'E2E Test Groceries');
        await page.fill('input[name="amount"]', '150');
        await page.selectOption('select[name="type"]', 'EXPENSE');
        await page.selectOption('select[name="category"]', 'Food');
        await page.click('text=Save Transaction');
        await expect(page.locator('text=E2E Test Groceries').first())
            .toBeVisible();
    });

    test('BVA01 - Amount boundary - minimum valid amount 0.01',
        async ({ page }) => {
            await page.goto(`${BASE_URL}/transactions`);
            await page.click('text=+ Add Transaction');
            await page.fill('input[name="title"]', 'Min Amount Test');
            await page.fill('input[name="amount"]', '0.01');
            await page.selectOption('select[name="type"]', 'EXPENSE');
            await page.selectOption('select[name="category"]', 'Food');
            await page.click('text=Save Transaction');
            await expect(page.locator('text=Min Amount Test').first())
                .toBeVisible();
        });

    test('FT01 - Filter transactions by INCOME type', async ({ page }) => {
        await page.goto(`${BASE_URL}/transactions`);
        await page.locator('select').first().selectOption('INCOME');
        const rows = page.locator('table tbody tr');
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(rows.nth(i).locator('td').nth(1))
                .toContainText('INCOME');
        }
    });

    test('FT02 - Filter transactions by EXPENSE type', async ({ page }) => {
        await page.goto(`${BASE_URL}/transactions`);
        await page.locator('select').first().selectOption('EXPENSE');
        const rows = page.locator('table tbody tr');
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(rows.nth(i).locator('td').nth(1))
                .toContainText('EXPENSE');
        }
    });

    test('FT03 - Clear filters shows all transactions', async ({ page }) => {
        await page.goto(`${BASE_URL}/transactions`);
        await page.locator('select').first().selectOption('INCOME');
        await page.click('text=Clear Filters');
        await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    test('NAV01 - Logout redirects to login page', async ({ page }) => {
        await page.click('text=Logout');
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

});