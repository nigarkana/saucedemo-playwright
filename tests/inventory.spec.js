// tests/inventory.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

/**
 * Product catalog test suite.
 * Covers sorting correctness and add/remove-to-cart behavior —
 * the core interactions on the inventory page.
 */
test.describe('Product catalog', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('displays all six products', async () => {
    const names = await inventoryPage.getAllItemNames();
    expect(names).toHaveLength(6);
  });

  test('sorting price low to high orders items correctly', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorting price high to low orders items correctly', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('sorting name A to Z orders items alphabetically', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getAllItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('adding an item updates the cart badge count', async () => {
    expect(await inventoryPage.getCartCount()).toBe(0);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adding multiple items accumulates the cart badge count', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('removing an item decrements the cart badge count', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });
});
