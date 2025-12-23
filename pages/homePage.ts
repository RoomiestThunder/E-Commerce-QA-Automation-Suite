import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Home Page Object for SauceDemo
 */
export class HomePage extends BasePage {
  readonly cartIcon = this.page.locator('.shopping_cart_link');
  readonly cartBadge = this.page.locator('.shopping_cart_badge');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly logoutButton = this.page.locator('#logout_sidebar_link');
  readonly inventoryList = this.page.locator('.inventory_list');
  readonly productSortDropdown = this.page.locator('[data-test="product-sort-container"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page (inventory)
   */
  async navigateToHome() {
    await this.goto('/inventory.html');
  }

  /**
   * Open shopping cart
   */
  async openCart() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open burger menu
   */
  async openMenu() {
    await this.menuButton.click();
    await this.page.waitForTimeout(500); // Wait for animation
  }

  /**
   * Logout from account
   */
  async logout() {
    await this.openMenu();
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return this.inventoryList.isVisible().catch(() => false);
  }

  /**
   * Check if cart icon is visible
   */
  async isCartIconVisible(): Promise<boolean> {
    return this.cartIcon.isVisible().catch(() => false);
  }

  /**
   * Get number of items in cart
   */
  async getCartCount(): Promise<string> {
    const count = await this.cartBadge.textContent().catch(() => '0');
    return count || '0';
  }
}
