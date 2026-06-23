// pages/CheckoutPage.js

/**
 * Page Object covering the three-step SauceDemo checkout flow:
 * Step 1 (info form) -> Step 2 (overview) -> Step 3 (confirmation).
 */
class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Step 1: customer information
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.infoErrorMessage = page.locator('[data-test="error"]');

    // Step 2: order overview
    this.summaryItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3: confirmation
    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return parseFloat(text.replace('Total: $', ''));
  }

  async finishOrder() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };
