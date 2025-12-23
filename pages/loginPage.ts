import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Login Page Object
 * Methods for working with login and registration pages
 */
export class LoginPage extends BasePage {
  // Selectors for login form
  readonly emailInput = this.page.locator('[data-testid="login-email"], input[type="email"]');
  readonly passwordInput = this.page.locator('[data-testid="login-password"], input[type="password"]');
  readonly loginButton = this.page.locator('button[type="submit"]:has-text("Sign In"), button:has-text("Login")');
  readonly errorMessage = this.page.locator('[data-testid="error-message"], .error, .alert-danger');

  // Selectors for registration form
  readonly registerLink = this.page.locator('text=Register, text=Sign Up');
  readonly registerButton = this.page.locator('button:has-text("Register"), button:has-text("Create Account")');
  readonly firstNameInput = this.page.locator('[data-testid="first-name"], input[placeholder*="First"]');
  readonly lastNameInput = this.page.locator('[data-testid="last-name"], input[placeholder*="Last"]');
  readonly registerEmailInput = this.page.locator('[data-testid="register-email"]');
  readonly registerPasswordInput = this.page.locator('[data-testid="register-password"]');
  readonly confirmPasswordInput = this.page.locator('[data-testid="confirm-password"]');
  readonly agreeCheckbox = this.page.locator('input[type="checkbox"]');

  // Selectors for password recovery
  readonly forgotPasswordLink = this.page.locator('text=Forgot Password, text=Reset Password');
  readonly resetEmailInput = this.page.locator('[data-testid="reset-email"]');
  readonly resetButton = this.page.locator('button:has-text("Reset"), button:has-text("Send")');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/login');
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
    await this.waitForElement('[data-testid="error-message"]', 3000).catch(() => {});
    return this.getText('[data-testid="error-message"]');
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Navigate to registration page
   */
  async navigateToRegister() {
    await this.registerLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill in registration form
   */
  async fillRegistrationForm(
    email: string,
    password: string,
    firstName: string = 'Test',
    lastName: string = 'User'
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Accept terms and submit registration
   */
  async submitRegistration() {
    await this.agreeCheckbox.check();
    await this.registerButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Complete registration flow
   */
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    await this.navigateToRegister();
    await this.fillRegistrationForm(email, password, firstName, lastName);
    await this.submitRegistration();
  }

  /**
   * Navigate to password recovery page
   */
  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    await this.resetEmailInput.fill(email);
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return this.emailInput.isVisible().catch(() => false);
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    // Look for an element that appears after login (e.g., logout button)
    return this.page.locator('button:has-text("Logout"), button:has-text("Sign Out")').isVisible().catch(() => false);
  }
}
