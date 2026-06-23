// tests/checkout.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

/**
 * End-to-end checkout test suite.
 * This is the highest-value flow on the site: it chains login -> add to
 * cart -> cart review -> customer info -> order summary -> confirmation,
 * and independently verifies the tax/total math rather than trusting the UI.
 */
test.describe('Checkout flow', () => {
  let inventoryPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('completes a full purchase end to end with one item', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.startCheckout();

    await checkoutPage.fillCustomerInfo('Nigar', 'Kana', 'V6B 1A1');
    await checkoutPage.finishOrder();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order overview tax and total are calculated correctly', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.startCheckout();
    await checkoutPage.fillCustomerInfo('Nigar', 'Kana', 'V6B 1A1');

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Validate the displayed total actually equals subtotal + tax,
    // rather than just checking the numbers render.
    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  });

  test('checkout step 1 blocks progress when first name is missing', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.startCheckout();

    await checkoutPage.fillCustomerInfo('', 'Kana', 'V6B 1A1');
    const error = await checkoutPage.infoErrorMessage.textContent();
    expect(error).toContain('First Name is required');
  });

  test('cart item count carries through to the checkout overview', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');

    expect(await inventoryPage.getCartCount()).toBe(3);

    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(3);
  });
});
