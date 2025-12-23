import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Login Page Object for SauceDemo
 * Methods for working with login page
 */
export class LoginPage extends BasePage {
  // Selectors for login form (SauceDemo specific)
  readonly emailInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton = this.page.locator('[data-test="login-button"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');
  readonly errorButton = this.page.locator('[data-test="error-button"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/');
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    return this.errorMessage.textContent() || '';
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return this.emailInput.isVisible().catch(() => false);
  }

  /**
   * Check if user is logged in by checking for products page
   */
  async isLoggedIn(): Promise<boolean> {
    return this.page.locator('.inventory_list').isVisible().catch(() => false);
  }
}
