import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { ProductsPage } from '../pages/productsPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';

/**
 * Extended fixtures for tests
 */

type TestFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  /**
   * Page Object for login page
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Page Object for home page
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Page Object for products page
   */
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  /**
   * Page Object for shopping cart
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Page Object for checkout page
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Authenticated page with pre-logged-in user
   * (Requires TEST_USERNAME and TEST_PASSWORD environment variables)
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const email = process.env.TEST_USERNAME || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'TestPassword123!';

    await loginPage.navigateToLogin();
    await loginPage.login(email, password);

    // Verify that we are authenticated
    // This may depend on your application
    await page.waitForLoadState('networkidle');

    await use(page);
  },
});

export { expect } from '@playwright/test';
