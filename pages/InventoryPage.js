// pages/InventoryPage.js

/**
 * Page Object for the product listing (inventory) page.
 */
class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addItemToCartByName(name) {
    const item = this.page.locator('.inventory_item', { hasText: name });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCartByName(name) {
    const item = this.page.locator('.inventory_item', { hasText: name });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async getCartCount() {
    if (await this.cartBadge.count() === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getAllPrices() {
    const priceLocators = await this.page.locator('.inventory_item_price').allTextContents();
    return priceLocators.map((p) => parseFloat(p.replace('$', '')));
  }

  async getAllItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
