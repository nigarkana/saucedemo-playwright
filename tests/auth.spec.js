// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

/**
 * Authentication test suite.
 * Covers valid login, invalid credentials, locked-out user, and
 * empty-field validation — the standard set of cases for any login form.
 */
test.describe('Authentication', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('locked out user is blocked with a clear error message', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*saucedemo.com\/$/);
    const error = await loginPage.getErrorText();
    expect(error).toContain('locked out');
  });

  test('invalid password is rejected', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');
    const error = await loginPage.getErrorText();
    expect(error).toContain('Username and password do not match');
  });

  test('empty username shows required-field error', async ({ page }) => {
    await loginPage.login('', 'secret_sauce');
    const error = await loginPage.getErrorText();
    expect(error).toContain('Username is required');
  });

  test('empty password shows required-field error', async ({ page }) => {
    await loginPage.login('standard_user', '');
    const error = await loginPage.getErrorText();
    expect(error).toContain('Password is required');
  });
});
