import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Home Page Object
 */
export class HomePage extends BasePage {
  readonly searchInput = this.page.locator('[data-testid="search"], input[placeholder*="Search"]');
  readonly searchButton = this.page.locator('[data-testid="search-button"], button:has-text("Search")');
  readonly cartIcon = this.page.locator('[data-testid="cart-icon"], a[href*="cart"]');
  readonly userMenu = this.page.locator('[data-testid="user-menu"], button[aria-label="User Menu"]');
  readonly logoutButton = this.page.locator('button:has-text("Logout"), button:has-text("Sign Out")');
  readonly categoriesMenu = this.page.locator('[data-testid="categories"], nav');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.goto('/');
  }

  /**
   * Search for product
   */
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open shopping cart
   */
  async openCart() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open user menu
   */
  async openUserMenu() {
    await this.userMenu.click();
  }

  /**
   * Logout from account
   */
  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
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
    const badge = this.page.locator('[data-testid="cart-count"], .cart-badge');
    return badge.textContent().catch(() => '0');
  }
}
