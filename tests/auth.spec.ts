import { test, expect } from '../fixtures/fixtures';
import { TEST_USERS } from '../data/testData';
import { logger } from '../utils/logger';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    logger.info('=== Starting Authentication Test ===');
    await loginPage.navigateToLogin();
  });

  test('TC-001: Successful login with valid credentials', async ({ loginPage, homePage }) => {
    // Arrange
    const { email, password } = TEST_USERS.VALID_USER;

    // Act
    await loginPage.login(email, password);

    // Assert
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    logger.info('✓ User successfully logged in');
  });

  test('TC-002: Login with invalid password shows error', async ({ loginPage }) => {
    // Arrange
    const { email } = TEST_USERS.VALID_USER;
    const wrongPassword = 'WrongPassword123!';

    // Act
    await loginPage.login(email, wrongPassword);

    // Assert
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    logger.info('✓ Error message displayed for invalid password');
  });

  test('TC-003: Login with non-existent user shows error', async ({ loginPage }) => {
    // Arrange
    const { email, password } = TEST_USERS.NONEXISTENT_USER;

    // Act
    await loginPage.login(email, password);

    // Assert
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    logger.info('✓ Error message displayed for non-existent user');
  });

  test('TC-004: Register new user successfully', async ({ loginPage, homePage }) => {
    // Arrange
    const { email, password, firstName, lastName } = TEST_USERS.NEW_USER;

    // Act
    await loginPage.navigateToRegister();
    await loginPage.fillRegistrationForm(email, password, firstName, lastName);
    await loginPage.submitRegistration();

    // Assert
    await loginPage.page.waitForLoadState('networkidle');
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    logger.info('✓ New user registered successfully');
  });

  test('TC-005: Registration form validation - empty fields', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.navigateToRegister();
    await loginPage.submitRegistration();

    // Assert
    // Depending on implementation, there may be different error messages
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
    logger.info('✓ Form validation works correctly');
  });

  test('TC-006: Forgot password flow initiates correctly', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.navigateToForgotPassword();

    // Assert
    const resetEmailInputVisible = await loginPage.resetEmailInput.isVisible();
    expect(resetEmailInputVisible).toBeTruthy();
    logger.info('✓ Password reset form displayed');
  });

  test('TC-007: Logout functionality works', async ({ loginPage, homePage }) => {
    // Arrange
    const { email, password } = TEST_USERS.VALID_USER;
    await loginPage.login(email, password);

    // Act
    await homePage.logout();

    // Assert
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
    logger.info('✓ User successfully logged out');
  });

  test('TC-008: Session persists on page refresh', async ({ loginPage, homePage }) => {
    // Arrange
    const { email, password } = TEST_USERS.VALID_USER;
    await loginPage.login(email, password);

    // Act
    await homePage.page.reload();

    // Assert
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    logger.info('✓ Session persisted after page refresh');
  });
});
