// pages/CartPage.js

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
