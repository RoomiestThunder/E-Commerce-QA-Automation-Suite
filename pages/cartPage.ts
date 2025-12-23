import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Cart Page Object
 * Handles shopping cart interactions and operations
 */
export class CartPage extends BasePage {
  // Selectors for cart items
  readonly cartItems = this.page.locator('[data-testid="cart-item"], .cart-item');
  readonly itemName = this.page.locator('[data-testid="item-name"], .item-title');
  readonly itemPrice = this.page.locator('[data-testid="item-price"], .price');
  readonly itemQuantity = this.page.locator('[data-testid="item-quantity"], input[type="number"]');
  readonly removeItemButton = this.page.locator('[data-testid="remove-item"], button:has-text("Remove")');

  // Selectors for quantity modification
  readonly increaseQuantityButtons = this.page.locator('[data-testid="increase-qty"], button.increase');
  readonly decreaseQuantityButtons = this.page.locator('[data-testid="decrease-qty"], button.decrease');

  // Selectors for coupons
  readonly couponInput = this.page.locator('[data-testid="coupon"], input[placeholder*="Coupon"]');
  readonly applyCouponButton = this.page.locator('[data-testid="apply-coupon"], button:has-text("Apply")');
  readonly couponMessage = this.page.locator('[data-testid="coupon-message"], .coupon-result');
  readonly removeCouponButton = this.page.locator('[data-testid="remove-coupon"], button:has-text("Remove")');

  // Selectors for pricing information
  readonly subtotal = this.page.locator('[data-testid="subtotal"], .subtotal-price');
  readonly shippingCost = this.page.locator('[data-testid="shipping"], .shipping-price');
  readonly taxCost = this.page.locator('[data-testid="tax"], .tax-price');
  readonly discount = this.page.locator('[data-testid="discount"], .discount-price');
  readonly totalPrice = this.page.locator('[data-testid="total"], .total-price');

  // Selectors for shipping options
  readonly shippingOptions = this.page.locator('[data-testid="shipping-option"], input[type="radio"]');

  // Action buttons
  readonly continueShoppingButton = this.page.locator('button:has-text("Continue Shopping")');
  readonly checkoutButton = this.page.locator('[data-testid="checkout"], button:has-text("Checkout")');
  readonly emptyCartMessage = this.page.locator('[data-testid="empty-cart"], text=Your cart is empty');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the shopping cart page
   */
  async navigateToCart() {
    await this.goto('/cart');
  }

  /**
   * Get total count of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Get names of all items in cart
   */
  async getAllItemNames(): Promise<string[]> {
    return this.itemName.allTextContents();
  }

  /**
   * Get prices of all items in cart
   */
  async getAllItemPrices(): Promise<string[]> {
    return this.itemPrice.allTextContents();
  }

  /**
   * Get quantity of first item in cart
   */
  async getFirstItemQuantity(): Promise<string> {
    return this.itemQuantity.first().inputValue();
  }

  /**
   * Change quantity for specific cart item
   */
  async changeQuantity(itemIndex: number, quantity: number) {
    const quantityField = this.itemQuantity.nth(itemIndex);
    await quantityField.fill(quantity.toString());
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Increase item quantity using increment button
   */
  async increaseItemQuantity(itemIndex: number) {
    await this.increaseQuantityButtons.nth(itemIndex).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Decrease item quantity using decrement button
   */
  async decreaseItemQuantity(itemIndex: number) {
    await this.decreaseQuantityButtons.nth(itemIndex).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Remove item from cart by index
   */
  async removeItem(itemIndex: number) {
    await this.removeItemButton.nth(itemIndex).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Remove item from cart by name
   */
  async removeItemByName(itemName: string) {
    await this.page.locator(`[data-testid="cart-item"]:has-text("${itemName}") [data-testid="remove-item"]`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply coupon or discount code
   */
  async applyCoupon(couponCode: string) {
    await this.couponInput.fill(couponCode);
    await this.applyCouponButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get coupon application message
   */
  async getCouponMessage(): Promise<string> {
    const message = await this.couponMessage.textContent();
    return message || '';
  }

  /**
   * Remove applied coupon
   */
  async removeCoupon() {
    await this.removeCouponButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get subtotal price before shipping and tax
   */
  async getSubtotal(): Promise<string> {
    const content = await this.subtotal.textContent();
    return content || '';
  }

  /**
   * Get shipping cost
   */
  async getShippingCost(): Promise<string> {
    const content = await this.shippingCost.textContent();
    return content || '';
  }

  /**
   * Get tax amount
   */
  async getTaxCost(): Promise<string> {
    const content = await this.taxCost.textContent();
    return content || '';
  }

  /**
   * Get discount amount
   */
  async getDiscount(): Promise<string> {
    const content = await this.discount.textContent();
    return content || '';
  }

  /**
   * Get total cart price
   */
  async getTotalPrice(): Promise<string> {
    const content = await this.totalPrice.textContent();
    return content || '';
  }

  /**
   * Select shipping method by option index
   */
  async selectShippingOption(optionIndex: number) {
    await this.shippingOptions.nth(optionIndex).check();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Proceed to checkout page
   */
  async goToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return this.emptyCartMessage.isVisible().catch(() => false);
  }

  /**
   * Continue shopping and return to products page
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
