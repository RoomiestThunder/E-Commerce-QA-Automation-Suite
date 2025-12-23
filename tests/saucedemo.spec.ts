import { test, expect } from '../fixtures/fixtures';
import { TEST_USERS, PRODUCTS } from '../data/testData';
import { logger } from '../utils/logger';

test.describe('SauceDemo E2E Tests', () => {
  
  test.describe('Authentication', () => {
    test.beforeEach(async ({ loginPage }) => {
      logger.info('=== Starting Test ===');
      await loginPage.navigateToLogin();
    });

    test('TC-001: Successful login with valid credentials', async ({ loginPage, homePage }) => {
      const { email, password } = TEST_USERS.VALID_USER;
      
      await loginPage.login(email, password);
      
      const isLoggedIn = await homePage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
      logger.info('✓ User successfully logged in');
    });

    test('TC-002: Login with invalid password shows error', async ({ loginPage }) => {
      const { email } = TEST_USERS.VALID_USER;
      const wrongPassword = 'wrong_password';
      
      await loginPage.login(email, wrongPassword);
      
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Username and password do not match');
      logger.info('✓ Error message displayed for invalid password');
    });

    test('TC-003: Locked out user cannot login', async ({ loginPage }) => {
      const { email, password } = TEST_USERS.NONEXISTENT_USER;
      
      await loginPage.login(email, password);
      
      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('locked out');
      logger.info('✓ Locked out user blocked correctly');
    });

    test('TC-004: Logout functionality works', async ({ loginPage, homePage }) => {
      const { email, password } = TEST_USERS.VALID_USER;
      
      await loginPage.login(email, password);
      await homePage.logout();
      
      const isLoginFormVisible = await loginPage.isLoginFormVisible();
      expect(isLoginFormVisible).toBeTruthy();
      logger.info('✓ User successfully logged out');
    });
  });

  test.describe('Shopping Cart', () => {
    test.beforeEach(async ({ loginPage }) => {
      const { email, password } = TEST_USERS.VALID_USER;
      await loginPage.navigateToLogin();
      await loginPage.login(email, password);
    });

    test('TC-005: Add product to cart', async ({ page, homePage }) => {
      // Add first product
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      
      const cartCount = await homePage.getCartCount();
      expect(cartCount).toBe('1');
      logger.info('✓ Product added to cart successfully');
    });

    test('TC-006: Add multiple products to cart', async ({ page, homePage }) => {
      // Add multiple products
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
      
      const cartCount = await homePage.getCartCount();
      expect(cartCount).toBe('3');
      logger.info('✓ Multiple products added to cart');
    });

    test('TC-007: Remove product from cart', async ({ page, homePage }) => {
      // Add and then remove product
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
      
      const isCartEmpty = await homePage.getCartCount();
      expect(isCartEmpty).toBe('0');
      logger.info('✓ Product removed from cart');
    });

    test('TC-008: View cart contents', async ({ page, homePage }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await homePage.openCart();
      
      const cartTitle = await page.locator('.title').textContent();
      expect(cartTitle).toBe('Your Cart');
      
      const cartItem = await page.locator('.cart_item').count();
      expect(cartItem).toBe(1);
      logger.info('✓ Cart contents displayed correctly');
    });
  });

  test.describe('Checkout Process', () => {
    test.beforeEach(async ({ loginPage, page }) => {
      const { email, password } = TEST_USERS.VALID_USER;
      await loginPage.navigateToLogin();
      await loginPage.login(email, password);
      
      // Add product to cart
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();
    });

    test('TC-009: Complete checkout with valid information', async ({ page }) => {
      // Click checkout
      await page.locator('[data-test="checkout"]').click();
      
      // Fill checkout form
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();
      
      // Verify on overview page
      const title = await page.locator('.title').textContent();
      expect(title).toBe('Checkout: Overview');
      
      // Complete order
      await page.locator('[data-test="finish"]').click();
      
      // Verify order complete
      const completeHeader = await page.locator('.complete-header').textContent();
      expect(completeHeader).toContain('Thank you for your order');
      logger.info('✓ Checkout completed successfully');
    });

    test('TC-010: Checkout validation - empty fields', async ({ page }) => {
      await page.locator('[data-test="checkout"]').click();
      
      // Try to continue without filling form
      await page.locator('[data-test="continue"]').click();
      
      // Check for error
      const error = await page.locator('[data-test="error"]');
      await expect(error).toBeVisible();
      
      const errorText = await error.textContent();
      expect(errorText).toContain('First Name is required');
      logger.info('✓ Form validation working correctly');
    });

    test('TC-011: Cancel checkout returns to cart', async ({ page }) => {
      await page.locator('[data-test="checkout"]').click();
      await page.locator('[data-test="cancel"]').click();
      
      // Verify back on cart page
      const title = await page.locator('.title').textContent();
      expect(title).toBe('Your Cart');
      logger.info('✓ Checkout cancelled successfully');
    });
  });

  test.describe('Product Sorting', () => {
    test.beforeEach(async ({ loginPage }) => {
      const { email, password } = TEST_USERS.VALID_USER;
      await loginPage.navigateToLogin();
      await loginPage.login(email, password);
    });

    test('TC-012: Sort products by name (A to Z)', async ({ page }) => {
      await page.locator('[data-test="product-sort-container"]').selectOption('az');
      
      const productNames = await page.locator('.inventory_item_name').allTextContents();
      const sortedNames = [...productNames].sort();
      
      expect(productNames).toEqual(sortedNames);
      logger.info('✓ Products sorted A-Z correctly');
    });

    test('TC-013: Sort products by price (low to high)', async ({ page }) => {
      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
      
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const priceValues = prices.map(p => parseFloat(p.replace('$', '')));
      const sortedPrices = [...priceValues].sort((a, b) => a - b);
      
      expect(priceValues).toEqual(sortedPrices);
      logger.info('✓ Products sorted by price (low to high) correctly');
    });
  });
});
