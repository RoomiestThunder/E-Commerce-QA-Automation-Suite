import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Checkout Page Object
 * Handles checkout process including shipping, billing, and payment information
 */
export class CheckoutPage extends BasePage {
  // Shipping information selectors
  readonly firstNameInput = this.page.locator('[data-testid="shipping-first-name"], input[placeholder*="First"]');
  readonly lastNameInput = this.page.locator('[data-testid="shipping-last-name"], input[placeholder*="Last"]');
  readonly emailInput = this.page.locator('[data-testid="shipping-email"], input[type="email"]');
  readonly phoneInput = this.page.locator('[data-testid="shipping-phone"], input[type="tel"]');
  readonly addressInput = this.page.locator('[data-testid="shipping-address"], input[placeholder*="Address"]');
  readonly cityInput = this.page.locator('[data-testid="shipping-city"], input[placeholder*="City"]');
  readonly stateInput = this.page.locator('[data-testid="shipping-state"], input[placeholder*="State"]');
  readonly zipCodeInput = this.page.locator('[data-testid="shipping-zip"], input[placeholder*="Zip"]');
  readonly countrySelect = this.page.locator('[data-testid="shipping-country"], select');

  // Selectors for payment information
  readonly cardNameInput = this.page.locator('[data-testid="card-name"], input[placeholder*="Name"]');
  readonly cardNumberInput = this.page.locator('[data-testid="card-number"], input[placeholder*="Card"]');
  readonly cardExpiryInput = this.page.locator('[data-testid="card-expiry"], input[placeholder*="MM/YY"]');
  readonly cardCvcInput = this.page.locator('[data-testid="card-cvc"], input[placeholder*="CVC"]');

  // Checkboxes and toggles
  readonly sameAsShippingCheckbox = this.page.locator('[data-testid="same-as-shipping"]');
  readonly billingFirstNameInput = this.page.locator('[data-testid="billing-first-name"]');
  readonly billingLastNameInput = this.page.locator('[data-testid="billing-last-name"]');
  readonly billingAddressInput = this.page.locator('[data-testid="billing-address"]');

  // Selectors for discounts and coupons
  readonly giftCardInput = this.page.locator('[data-testid="gift-card"], input[placeholder*="Gift"]');
  readonly applyGiftCardButton = this.page.locator('[data-testid="apply-gift"], button:has-text("Apply")');

  // Selectors for shipping options
  readonly shippingOptions = this.page.locator('[data-testid="shipping-method"], input[type="radio"]');
  readonly shippingMethodLabel = this.page.locator('[data-testid="shipping-label"]');

  // Order summary
  readonly orderSummary = this.page.locator('[data-testid="order-summary"]');
  readonly subtotalPrice = this.page.locator('[data-testid="summary-subtotal"], .subtotal');
  readonly shippingPrice = this.page.locator('[data-testid="summary-shipping"], .shipping');
  readonly taxPrice = this.page.locator('[data-testid="summary-tax"], .tax');
  readonly totalPrice = this.page.locator('[data-testid="summary-total"], .total');

  // Action buttons
  readonly placeOrderButton = this.page.locator('[data-testid="place-order"], button:has-text("Place Order")');
  readonly submitPaymentButton = this.page.locator('[data-testid="submit-payment"], button:has-text("Pay")');
  readonly backButton = this.page.locator('button:has-text("Back")');

  // Messages
  readonly errorMessage = this.page.locator('[data-testid="error"], .alert-danger');
  readonly successMessage = this.page.locator('[data-testid="success"], .alert-success');

  // Step tabs
  readonly shippingTab = this.page.locator('[data-testid="shipping-tab"]');
  readonly paymentTab = this.page.locator('[data-testid="payment-tab"]');
  readonly reviewTab = this.page.locator('[data-testid="review-tab"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout page
   */
  async navigateToCheckout() {
    await this.goto('/checkout');
  }

  /**
   * Fill shipping information
   */
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    country: string = 'US'
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    await this.zipCodeInput.fill(zipCode);
    await this.countrySelect.selectOption(country);
  }

  /**
   * Set shipping address same as billing address
   */
  async setSameAsShipping() {
    await this.sameAsShippingCheckbox.check();
  }

  /**
   * Fill billing information (if different from shipping)
   */
  async fillBillingInfo(
    firstName: string,
    lastName: string,
    address: string
  ) {
    await this.billingFirstNameInput.fill(firstName);
    await this.billingLastNameInput.fill(lastName);
    await this.billingAddressInput.fill(address);
  }

  /**
   * Fill payment card information
   */
  async fillCardInfo(
    cardName: string,
    cardNumber: string,
    expiry: string,
    cvc: string
  ) {
    await this.cardNameInput.fill(cardName);
    await this.cardNumberInput.fill(cardNumber);
    await this.cardExpiryInput.fill(expiry);
    await this.cardCvcInput.fill(cvc);
  }

  /**
   * Select shipping method
   */
  async selectShippingMethod(methodIndex: number) {
    await this.shippingOptions.nth(methodIndex).check();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply gift card code
   */
  async applyGiftCard(giftCardCode: string) {
    await this.giftCardInput.fill(giftCardCode);
    await this.applyGiftCardButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get subtotal price (before shipping and tax)
   */
  async getSubtotal(): Promise<string> {
    return this.subtotalPrice.textContent() || '';
  }

  /**
   * Get shipping cost
   */
  async getShippingCost(): Promise<string> {
    return this.shippingPrice.textContent() || '';
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<string> {
    return this.taxPrice.textContent() || '';
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<string> {
    return this.totalPrice.textContent() || '';
  }

  /**
   * Place order
   */
  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Submit payment
   */
  async submitPayment() {
    await this.submitPaymentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Complete full checkout process
   */
  async completeCheckout(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    cardName: string,
    cardNumber: string,
    expiry: string,
    cvc: string
  ) {
    // Fill shipping address
    await this.fillShippingInfo(
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode
    );

    // Billing address is same as shipping
    await this.setSameAsShipping();

    // Fill payment card information
    await this.fillCardInfo(cardName, cardNumber, expiry, cvc);

    // Select standard shipping
    await this.selectShippingMethod(0);

    // Place order
    await this.placeOrder();

    // Confirm payment
    await this.submitPayment();

    // Wait for successful completion
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent() || '';
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Go to shipping tab
   */
  async goToShippingTab() {
    await this.shippingTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to payment tab
   */
  async goToPaymentTab() {
    await this.paymentTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to review tab
   */
  async goToReviewTab() {
    await this.reviewTab.click();
    await this.page.waitForLoadState('networkidle');
  }
}
